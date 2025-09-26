<?php
header("Content-Type: application/json; charset=UTF-8");

$conexion = new mysqli("localhost", "root", "", "fisiowelfare");
if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error en la conexión a la BD."]);
    exit;
}

$id_cita = isset($_GET['id_cita']) ? intval($_GET['id_cita']) : 0;
if ($id_cita <= 0) {
    echo json_encode(["success" => false, "message" => "ID de cita inválido."]);
    exit;
}

// Ajuste: usar id_cita en lugar de id
$sql = "SELECT id_cita, id_paciente, fecha_cita, hora_inicio, tipo_consulta, terapia, estado 
        FROM citas WHERE id_cita = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_cita);
$stmt->execute();
$result = $stmt->get_result();
$cita = $result->fetch_assoc();

if ($cita) {
    echo json_encode([
        "success" => true,
        "cita" => [
            "id" => $cita['id_cita'],
            "id_paciente" => $cita['id_paciente'],
            "fecha_cita" => $cita['fecha_cita'],
            "hora_inicio" => $cita['hora_inicio'],
            "tipo_consulta" => $cita['tipo_consulta'],
            "terapia" => $cita['terapia'],
            "estado" => $cita['estado']
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Cita no encontrada."]);
}

$stmt->close();
$conexion->close();
?>
