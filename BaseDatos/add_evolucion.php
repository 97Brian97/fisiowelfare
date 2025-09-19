<?php
session_start();
header('Content-Type: application/json');

// Conexión a la BD
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error en la conexión a la BD."]);
    exit();
}

// Recibir JSON del fetch
$data = json_decode(file_get_contents("php://input"), true);

$id_historia = $data['id_historia'] ?? null;
$texto = $data['texto'] ?? null;

if (!$id_historia || !$texto) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

// Insertar nueva evolución
$sql = "INSERT INTO evoluciones (id_historia, fecha, texto) VALUES (?, NOW(), ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("is", $id_historia, $texto);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "fecha" => date("Y-m-d H:i:s")
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar evolución"]);
}
