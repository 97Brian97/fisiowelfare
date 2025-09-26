<?php
header("Content-Type: application/json; charset=UTF-8");

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error en la conexión a la BD."]);
    exit;
}

// Verificar que se recibió id_cita
$id_cita = isset($_POST['id_cita']) ? intval($_POST['id_cita']) : 0;
if ($id_cita <= 0) {
    echo json_encode(["success" => false, "message" => "ID de cita inválido."]);
    exit;
}

// Actualizar estado de la cita a 'Cancelada'
$sql = "UPDATE citas SET estado = 'Cancelada' WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_cita);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cita cancelada correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "No se pudo cancelar la cita."]);
}

$stmt->close();
$conexion->close();
?>
