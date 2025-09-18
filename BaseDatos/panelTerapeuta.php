<?php
session_start();
header('Content-Type: application/json');

// Verificar sesión
if (!isset($_SESSION['id_usuario']) || $_SESSION['rol'] != 'fisioterapeuta') {
    echo json_encode(["error" => "No autorizado"]);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");
if ($conexion->connect_error) {
    echo json_encode(["error"=>"Conexión fallida: ".$conexion->connect_error]);
    exit;
}

$fecha_hoy = date("Y-m-d");

// Citas hoy
$stmt = $conexion->prepare("
    SELECT c.id_cita, c.fecha_cita, TIME(c.hora_inicio) AS hora_inicio, p.nombres, p.apellidos, c.estado AS estado_cita
    FROM citas c 
    JOIN pacientes p ON c.id_paciente = p.id_paciente
    WHERE c.id_usuario = ? AND c.fecha_cita = ?
");
$stmt->bind_param("is", $id_usuario, $fecha_hoy);
$stmt->execute();
$citasHoy = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Próxima cita
$stmt = $conexion->prepare("
    SELECT c.id_cita, c.fecha_cita, TIME(c.hora_inicio) AS hora_inicio, p.nombres, p.apellidos
    FROM citas c 
    JOIN pacientes p ON c.id_paciente = p.id_paciente
    WHERE c.id_usuario = ? AND c.fecha_cita >= ?
    ORDER BY c.fecha_cita ASC, c.hora_inicio ASC
    LIMIT 1
");
$stmt->bind_param("is", $id_usuario, $fecha_hoy);
$stmt->execute();
$proximaCita = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Citas canceladas
$stmt = $conexion->prepare("
    SELECT COUNT(*) AS total_canceladas 
    FROM citas 
    WHERE id_usuario=? AND estado='cancelada'
");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$citasCanceladas = $stmt->get_result()->fetch_assoc()['total_canceladas'];
$stmt->close();

// Notificaciones (últimas 3)
$stmt = $conexion->prepare("
    SELECT c.id_cita, c.fecha_cita, TIME(c.hora_inicio) AS hora_inicio, p.nombres, p.apellidos, c.estado AS estado_cita
    FROM citas c 
    JOIN pacientes p ON c.id_paciente = p.id_paciente
    WHERE c.id_usuario=?
    ORDER BY c.fecha_cita DESC, c.hora_inicio DESC
    LIMIT 3
");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$notificaciones = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Pacientes activos
$stmt = $conexion->prepare("
    SELECT DISTINCT p.id_paciente
    FROM pacientes p
    JOIN citas c ON c.id_paciente = p.id_paciente
    JOIN tratamientos t ON t.id_historia = (
        SELECT h.id_historia FROM historias_clinicas h
        WHERE h.id_paciente = p.id_paciente
        ORDER BY h.fecha_registro DESC LIMIT 1
    )
    WHERE c.id_usuario = ? AND t.estado != 'finalizado'
");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$pacientesActivos = $stmt->get_result()->num_rows;
$stmt->close();

// Tratamientos activos
$stmt = $conexion->prepare("
    SELECT t.nombre_procedimiento, t.estado, p.nombres, p.apellidos
    FROM tratamientos t
    JOIN historias_clinicas h ON t.id_historia = h.id_historia
    JOIN pacientes p ON h.id_paciente = p.id_paciente
    JOIN citas c ON c.id_paciente = p.id_paciente
    WHERE c.id_usuario = ? AND t.estado != 'finalizado'
    GROUP BY p.id_paciente
");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$tratamientosActivos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Citas programadas (próximas 5)
$stmt = $conexion->prepare("
    SELECT c.fecha_cita, TIME(c.hora_inicio) AS hora_inicio, p.nombres, p.apellidos, c.estado
    FROM citas c
    JOIN pacientes p ON c.id_paciente = p.id_paciente
    WHERE c.id_usuario = ? AND c.fecha_cita >= ?
    ORDER BY c.fecha_cita ASC, c.hora_inicio ASC
    LIMIT 5
");
$stmt->bind_param("is", $id_usuario, $fecha_hoy);
$stmt->execute();
$citasProgramadas = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$conexion->close();

// Retornar todo en JSON
echo json_encode([
    "citasHoy" => $citasHoy,
    "proximaCita" => $proximaCita,
    "citasCanceladas" => $citasCanceladas,
    "notificaciones" => $notificaciones,
    "pacientesActivos" => $pacientesActivos,
    "tratamientosActivos" => $tratamientosActivos,
    "citasProgramadas" => $citasProgramadas
]);
?>
