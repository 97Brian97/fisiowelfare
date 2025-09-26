<?php
header("Content-Type: application/json; charset=UTF-8");

$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error en la conexión a la base de datos."]));
}

// Solo seleccionamos fisioterapeutas activos
$sql = "SELECT id_usuario AS id_terapeuta, CONCAT(nombre, ' ', apellido) AS nombre
        FROM usuarios
        WHERE rol = 'fisioterapeuta' AND estado = 'activo'";

$result = $conexion->query($sql);

if ($result && $result->num_rows > 0) {
    $terapeutas = [];
    while ($row = $result->fetch_assoc()) {
        $terapeutas[] = $row;
    }
    echo json_encode(["success" => true, "terapeutas" => $terapeutas]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron fisioterapeutas."]);
}

$conexion->close();
