<?php
header("Content-Type: application/json; charset=UTF-8");
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error en la conexión a la BD."]));
}

$id = intval($_GET['id'] ?? 0);
$type = $_GET['type'] ?? '';

if ($id > 0 && in_array($type, ['paciente','terapeuta'])) {
    if ($type === 'paciente') {
        $sql = "DELETE FROM pacientes WHERE id_paciente = $id";
    } else {
        $sql = "DELETE FROM usuarios WHERE id_usuario = $id AND rol = 'fisioterapeuta'";
    }

    if ($conexion->query($sql)) {
        echo json_encode(["success" => true, "message" => "Registro eliminado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: ".$conexion->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Parámetros inválidos"]);
}

$conexion->close();
