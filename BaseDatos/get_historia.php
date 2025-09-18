<?php
include("conexion.php");

$id_paciente = $_GET['id_paciente'] ?? 0;

// Obtener datos del paciente
$pacienteQuery = $conexion->prepare("SELECT id_paciente, nombre, documento as dni FROM pacientes WHERE id_paciente=?");
$pacienteQuery->bind_param("i", $id_paciente);
$pacienteQuery->execute();
$paciente = $pacienteQuery->get_result()->fetch_assoc();

if (!$paciente) {
    echo json_encode(['success' => false, 'message' => 'Paciente no encontrado']);
    exit;
}

// Obtener historia clínica (última abierta por defecto)
$historiaQuery = $conexion->prepare("SELECT * FROM historias_clinicas WHERE id_paciente=? ORDER BY fecha_registro DESC LIMIT 1");
$historiaQuery->bind_param("i", $id_paciente);
$historiaQuery->execute();
$historia = $historiaQuery->get_result()->fetch_assoc();

// Obtener progresiones (si tienes tabla aparte, ejemplo 'progresiones')
$progresiones = [];
if ($historia) {
    $progQuery = $conexion->prepare("SELECT fecha, texto FROM progresiones WHERE id_historia=? ORDER BY fecha ASC");
    $progQuery->bind_param("i", $historia['id_historia']);
    $progQuery->execute();
    $resultProg = $progQuery->get_result();
    while ($row = $resultProg->fetch_assoc()) {
        $progresiones[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'paciente' => $paciente,
    'historia' => $historia,
    'progresiones' => $progresiones
]);
?>
