<?php
header("Content-Type: application/json; charset=UTF-8");
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error en la conexión a la BD."]));
}

$sql = "SELECT id_usuario, tipo_documento, numero_documento, nombre, apellido, edad, 
               rol, email, estado 
        FROM usuarios 
        WHERE rol = 'fisioterapeuta'";

$resultado = $conexion->query($sql);

$terapeutas = [];
if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $terapeutas[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $terapeutas]);

$conexion->close();
