<?php
header("Content-Type: application/json; charset=UTF-8");
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error en la conexión a la BD."]));
}

$sql = "SELECT id_paciente, tipo_documento, numero_documento, nombres, apellidos, 
               fecha_nacimiento, edad, sexo, telefono, email, direccion, estado 
        FROM pacientes";

$resultado = $conexion->query($sql);

$pacientes = [];
if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $pacientes[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $pacientes]);

$conexion->close();
