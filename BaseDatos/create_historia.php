<?php
include("conexion.php");

$id_paciente = $_POST['id_paciente'] ?? null;
$motivo = $_POST['motivo_consulta'] ?? '';
$antecedentes = $_POST['antecedentes'] ?? '';
$diagnostico = $_POST['diagnostico'] ?? '';
$tratamiento = $_POST['tratamiento'] ?? '';

// En este punto también puedes validar que exista un id_cita y un id_usuario
// pero para simplificar los dejamos nulos/0 si no están
$id_cita = 0;
$id_usuario = 1; // Puedes obtenerlo de la sesión ($_SESSION['id_usuario'])

if (!$id_paciente) {
    echo json_encode(['success' => false, 'message' => 'Falta ID del paciente']);
    exit;
}

$query = $conexion->prepare("
    INSERT INTO historias_clinicas (id_paciente, id_cita, motivo_consulta, antecedentes, diagnostico, tratamiento, id_usuario, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'abierta')
");
$query->bind_param("iissssi", $id_paciente, $id_cita, $motivo, $antecedentes, $diagnostico, $tratamiento, $id_usuario);

if ($query->execute()) {
    echo json_encode(['success' => true, 'id_historia' => $conexion->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al crear historia clínica']);
}
?>
