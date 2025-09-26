<?php
header("Content-Type: application/json; charset=UTF-8");

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");
if ($conexion->connect_error) {
    echo json_encode(["existe" => false, "error" => "Error en la conexión a la BD."]);
    exit;
}

// Recibir parámetros
$id_paciente = isset($_GET['id_paciente']) ? intval($_GET['id_paciente']) : 0;
$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';
$hora = isset($_GET['hora']) ? $_GET['hora'] : '';
$id_cita_actual = isset($_GET['id_cita_actual']) ? intval($_GET['id_cita_actual']) : 0;

if ($id_paciente <= 0 || empty($fecha) || empty($hora)) {
    echo json_encode(["existe" => false, "error" => "Parámetros inválidos."]);
    exit;
}

// Verificar si ya existe otra cita en la misma fecha y hora, excluyendo la que se está reprogramando
$sql = "SELECT COUNT(*) AS total 
        FROM citas 
        WHERE id_paciente = ? 
            AND fecha_cita = ? 
            AND hora_inicio = ? 
            AND estado != 'cancelada' 
            AND id_cita != ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("issi", $id_paciente, $fecha, $hora, $id_cita_actual);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode(["existe" => $row['total'] > 0]);

$stmt->close();
$conexion->close();
?>
