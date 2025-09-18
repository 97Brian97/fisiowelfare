<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json; charset=utf-8');

function send_json($data) {
    echo json_encode($data);
    exit;
}

function log_error($mensaje) {
    file_put_contents(__DIR__ . "/error_log.txt", date("Y-m-d H:i:s") . " - " . $mensaje . PHP_EOL, FILE_APPEND);
}

// Conexión a base de datos (MySQL)
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");
if ($conexion->connect_error) {
    log_error("Error conexión BD: " . $conexion->connect_error);
    send_json(["success" => false, "message" => "Error en la conexión a la BD."]);
}

// Obtener datos JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$numero_documento = trim($data["numero_documento"] ?? "");
$contrasena = $data["contrasena"] ?? "";

if (empty($numero_documento) || empty($contrasena)) {
    send_json(["success" => false, "message" => "Documento y contraseña son obligatorios."]);
}

// verificar login
function verificar_usuario($conexion, $tabla, $campos, $numero_documento, $contrasena) {
    $sql = "SELECT ".implode(",",$campos)." FROM $tabla WHERE numero_documento = ?";
    $stmt = $conexion->prepare($sql);
    if (!$stmt) return false;
    $stmt->bind_param("s", $numero_documento);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows === 1) {
        $usuario = $result->fetch_assoc();
        if (password_verify($contrasena, $usuario["contrasena"])) {
            return $usuario;
        }
    }
    return false;
}

// Verificar pacientes
$campos_pacientes = ["id_paciente AS id", "numero_documento", "contrasena", "nombres", "apellidos"];
$usuario = verificar_usuario($conexion, "pacientes", $campos_pacientes, $numero_documento, $contrasena);

if ($usuario) {
    $_SESSION["id_paciente"] = $usuario["id"];
    $_SESSION["nombre"] = $usuario["nombres"];
    $_SESSION["apellido"] = $usuario["apellidos"];
    $redirect = "../paginas/panelPaciente.html";
    send_json(["success"=>true, "usuario"=>$usuario, "redirect"=>$redirect]);
}

// Verificar usuarios (admin / fisioterapeuta)
$campos_usuarios = ["id_usuario AS id", "numero_documento", "contrasena", "nombre AS nombres", "apellido AS apellidos", "rol"];
$usuario = verificar_usuario($conexion, "usuarios", $campos_usuarios, $numero_documento, $contrasena);

if ($usuario) {
    $_SESSION["id_usuario"] = $usuario["id"];
    $_SESSION["nombre"] = $usuario["nombres"];
    $_SESSION["apellido"] = $usuario["apellidos"];
    $_SESSION["rol"] = $usuario["rol"];

    switch($usuario["rol"]) {
        case "fisioterapeuta":
            $redirect = "../paginas/panelTerapeuta.html";
            break;
        case "admin":
            $redirect = "../paginas/panelAdministrador.html";
            break;
        default:
            $redirect = "../paginas/panelPaciente.html";
            break;
    }
    send_json(["success"=>true, "usuario"=>$usuario, "redirect"=>$redirect]);
}

// Si no existe en ninguna tabla
send_json(["success"=>false, "message"=>"Documento o contraseña incorrectos."]);

$conexion->close();
?>
