<?php
header("Content-Type: application/json; charset=UTF-8");
include("conexion.php");

$id_cita = $_POST["id_cita"] ?? 0;
$fecha   = $_POST["fechaNueva"] ?? "";
$hora    = $_POST["horaNueva"] ?? "";

// Validar datos
if ($id_cita == 0 || empty($fecha) || empty($hora)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos (id_cita=$id_cita, fecha=$fecha, hora=$hora)."]);
    exit;
}

$fechaHoraInicio = $fecha . " " . $hora . ":00";

// Hora fin → ejemplo: 1 hora después
$fechaHoraFin = date("Y-m-d H:i:s", strtotime($fechaHoraInicio . " +1 hour"));

$sql = "UPDATE citas 
        SET fecha_cita = ?, hora_inicio = ?, hora_fin = ?, estado = 'programada'
        WHERE id_cita = ?";

$stmt = $conexion->prepare($sql);
if ($stmt) {
    $stmt->bind_param("sssi", $fecha, $fechaHoraInicio, $fechaHoraFin, $id_cita);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cita reagendada correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar la cita."]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Error en la preparación de la consulta."]);
}

$conexion->close();
