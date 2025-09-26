<?php
header("Content-Type: application/json; charset=UTF-8");

// Conexión a la BD
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");
if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error en la conexión a la BD."]);
    exit;
}

// Recibir datos POST
$id_cita = isset($_POST['id_cita']) ? intval($_POST['id_cita']) : 0;
$fecha = isset($_POST['fecha']) ? $_POST['fecha'] : '';
$hora = isset($_POST['hora']) ? $_POST['hora'] : '';

if ($id_cita <= 0 || empty($fecha) || empty($hora)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
    exit;
}

// Actualizar cita
$sql = "UPDATE citas SET fecha_cita = ?, hora_inicio = ? WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssi", $fecha, $hora, $id_cita);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cita reprogramada correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "No se pudo reprogramar la cita."]);
}

$stmt->close();
$conexion->close();
?>
