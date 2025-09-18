<?php
session_start();

// Conexión a la BD
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error en la conexión a la BD."]));
}

// Recibir JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validar campos obligatorios
if (
    empty($data["nombres"]) || empty($data["apellidos"]) ||
    empty($data["tipo_documento"]) || empty($data["numero_documento"]) ||
    empty($data["fecha_nacimiento"]) || empty($data["sexo"]) ||
    empty($data["telefono"]) || empty($data["email"]) ||
    empty($data["contrasena"])
) {
    echo json_encode(["success" => false, "message" => "Todos los campos obligatorios deben completarse."]);
    exit;
}

// Verificar si el email o número de documento ya existe
$check = $conexion->prepare("SELECT id_paciente FROM pacientes WHERE email = ? OR numero_documento = ?");
$check->bind_param("ss", $data["email"], $data["numero_documento"]);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Ya existe un paciente con este correo o documento."]);
    $check->close();
    $conexion->close();
    exit;
}
$check->close();

// Encriptar contraseña
$contrasenaHash = password_hash($data["contrasena"], PASSWORD_BCRYPT);

// Insertar en la BD (sin campo edad porque se calcula)
$sql = "INSERT INTO pacientes 
    (nombres, apellidos, tipo_documento, numero_documento, fecha_nacimiento, sexo, telefono, email, direccion, contrasena, fecha_registro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

$stmt = $conexion->prepare($sql);

$stmt->bind_param(
    "ssssssssss",
    $data["nombres"],
    $data["apellidos"],
    $data["tipo_documento"],
    $data["numero_documento"],
    $data["fecha_nacimiento"],
    $data["sexo"],
    $data["telefono"],
    $data["email"],
    $data["direccion"],
    $contrasenaHash
);

if ($stmt->execute()) {
    // Obtener ID recién insertado
    $id_paciente = $stmt->insert_id;

    // Crear sesión automática
    $_SESSION["paciente_id"] = $id_paciente;
    $_SESSION["paciente_nombre"] = $data["nombres"];

    echo json_encode([
        "success" => true,
        "message" => "Paciente registrado correctamente.",
        "redirect" => "../paginas/panelPaciente.html"
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar paciente: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>