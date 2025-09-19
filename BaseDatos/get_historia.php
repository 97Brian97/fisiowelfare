<?php
session_start();
header('Content-Type: application/json');

// Conexión a la BD
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error en la conexión a la BD."]);
    exit();
}

$id_paciente = $_GET['id_paciente'] ?? null;

if (!$id_paciente) {
    echo json_encode(["success" => false, "message" => "ID de paciente no proporcionado"]);
    exit();
}

// Obtener datos del paciente
$sql_paciente = "SELECT id_paciente, nombre, dni FROM pacientes WHERE id_paciente = ?";
$stmt = $conexion->prepare($sql_paciente);
$stmt->bind_param("i", $id_paciente);
$stmt->execute();
$result_paciente = $stmt->get_result();
$paciente = $result_paciente->fetch_assoc();

// Obtener historia clínica (si existe)
$sql_historia = "SELECT * FROM historias WHERE id_paciente = ?";
$stmt = $conexion->prepare($sql_historia);
$stmt->bind_param("i", $id_paciente);
$stmt->execute();
$result_historia = $stmt->get_result();
$historia = $result_historia->fetch_assoc();

// Obtener evoluciones de la historia
$evoluciones = [];
if ($historia) {
    $sql_evoluciones = "SELECT fecha, texto FROM evoluciones WHERE id_historia = ? ORDER BY fecha DESC";
    $stmt = $conexion->prepare($sql_evoluciones);
    $stmt->bind_param("i", $historia['id_historia']);
    $stmt->execute();
    $result_evoluciones = $stmt->get_result();
    while ($row = $result_evoluciones->fetch_assoc()) {
        $evoluciones[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "paciente" => $paciente,
    "historia" => $historia,
    "evoluciones" => $evoluciones
]);
