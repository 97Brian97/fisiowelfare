<?php
include("conexion.php");

$data = json_decode(file_get_contents("php://input"), true);

$id_historia = $data['id_historia'] ?? null;
$texto = $data['texto'] ?? '';

if (!$id_historia || !$texto) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$fecha = date("Y-m-d");

$query = $conexion->prepare("INSERT INTO progresiones (id_historia, fecha, texto) VALUES (?, ?, ?)");
$query->bind_param("iss", $id_historia, $fecha, $texto);

if ($query->execute()) {
    echo json_encode(['success' => true, 'fecha' => $fecha]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar progresión']);
}
?>
