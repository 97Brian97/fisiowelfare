<?php
session_start();
header('Content-Type: application/json');

$conexion = new mysqli("localhost", "root", "", "fisiowelfare");
if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la BD"]));
}

// Recibir id del paciente por GET
$id_paciente = $_GET['id_paciente'] ?? null;
if (!$id_paciente) {
    echo json_encode(["success" => false, "message" => "ID de paciente no recibido"]);
    exit;
}

// Información básica del paciente
$sqlPaciente = $conexion->prepare("SELECT id_paciente, numero_documento, nombres, apellidos, fecha_nacimiento, sexo, telefono, email FROM pacientes WHERE id_paciente = ?");
$sqlPaciente->bind_param("i", $id_paciente);
$sqlPaciente->execute();
$resultPaciente = $sqlPaciente->get_result();
$paciente = $resultPaciente->fetch_assoc();

// Próxima cita
$sqlCita = $conexion->prepare("
    SELECT c.id_cita, c.fecha_cita, c.hora_inicio, c.hora_fin, c.estado, 
        c.tipo_consulta, c.terapia, c.observaciones, 
        u.nombre AS terapeuta
    FROM citas c
    INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_paciente = ? AND c.estado = 'programada'
    ORDER BY c.fecha_cita ASC LIMIT 1
");
$sqlCita->bind_param("i", $id_paciente);
$sqlCita->execute();
$resultCita = $sqlCita->get_result();
$cita = $resultCita->fetch_assoc();

// Tratamiento activo (último en progreso)
$sqlTrat = $conexion->prepare("
    SELECT t.nombre_procedimiento, t.estado, t.fecha_inicio, t.fecha_fin
    FROM tratamientos t
    INNER JOIN historias_clinicas h ON t.id_historia = h.id_historia
    WHERE h.id_paciente = ?
    ORDER BY t.fecha_inicio DESC LIMIT 1
");
$sqlTrat->bind_param("i", $id_paciente);
$sqlTrat->execute();
$resultTrat = $sqlTrat->get_result();
$tratamiento = $resultTrat->fetch_assoc();

// Actividad reciente (últimas 3 citas)
$sqlActividades = $conexion->prepare("
    SELECT c.fecha_cita, c.estado, c.tipo_consulta, c.terapia,
        t.nombre_procedimiento
    FROM citas c
    LEFT JOIN historias_clinicas h ON c.id_cita = h.id_cita
    LEFT JOIN tratamientos t ON h.id_historia = t.id_historia
    WHERE c.id_paciente = ?
    ORDER BY c.fecha_cita DESC LIMIT 3
");
$sqlActividades->bind_param("i", $id_paciente);
$sqlActividades->execute();
$resultActividades = $sqlActividades->get_result();
$actividades = [];
while ($row = $resultActividades->fetch_assoc()) {
    $actividades[] = $row;
}

// Resumen de citas
$sqlResumen = $conexion->prepare("
    SELECT 
        SUM(estado='atendida') AS atendidas,
        SUM(estado='programada') AS programadas,
        SUM(estado='cancelada') AS canceladas
    FROM citas WHERE id_paciente = ?
");
$sqlResumen->bind_param("i", $id_paciente);
$sqlResumen->execute();
$resResumen = $sqlResumen->get_result();
$resumen = $resResumen->fetch_assoc();

// Respuesta JSON
echo json_encode([
    "success" => true,
    "paciente" => $paciente,
    "proximaCita" => $cita,
    "tratamientoActivo" => $tratamiento,
    "actividadesRecientes" => $actividades,
    "resumen" => $resumen
]);

$sqlPaciente->close();
$sqlCita->close();
$sqlTrat->close();
$sqlActividades->close();
$sqlResumen->close();
$conexion->close();
?>
