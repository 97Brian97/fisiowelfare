<?php
header("Content-Type: application/json; charset=UTF-8");
session_start();

require_once("verificarSesion.php");

$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

if (!isset($_SESSION["id_paciente"])) {
    echo json_encode(["success" => false, "message" => "Sesión no válida. Inicie sesión nuevamente."]);
    exit;
}

$id_paciente   = $_SESSION["id_paciente"];
$tipo_consulta = $_POST["tipo_consulta"] ?? '';
$terapia       = $_POST["terapia"] ?? '';
$fecha         = $_POST["fecha"] ?? '';
$hora          = $_POST["hora"] ?? '';
$id_usuario    = $_POST["terapeuta"] ?? '';
$observaciones = $_POST["observaciones"] ?? '';

if (!$tipo_consulta || !$terapia || !$fecha || !$hora || !$id_usuario) {
    echo json_encode(["success" => false, "message" => "Todos los campos obligatorios deben completarse."]);
    exit;
}

// ✅ Convertir fecha de dd/mm/yyyy a yyyy-mm-dd
if ($fecha) {
    $partes = explode("/", $fecha); // [dd, mm, yyyy]
    if (count($partes) === 3) {
        $fecha = $partes[2] . "-" . $partes[1] . "-" . $partes[0]; // yyyy-mm-dd
    }
}

// Unir fecha y hora en formato DATETIME
$hora_inicio = $fecha . " " . $hora . ":00";
$hora_fin    = date("Y-m-d H:i:s", strtotime($hora_inicio . " +1 hour"));

$sql = "INSERT INTO citas 
        (id_paciente, id_usuario, fecha_cita, hora_inicio, hora_fin, tipo_consulta, terapia, observaciones) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en la preparación de la consulta: " . $conexion->error]);
    exit;
}

$stmt->bind_param("iissssss", $id_paciente, $id_usuario, $fecha, $hora_inicio, $hora_fin, $tipo_consulta, $terapia, $observaciones);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cita agendada correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al agendar la cita: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
