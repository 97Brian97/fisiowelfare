<?php
session_start();

// Conexión a la base de datos (MySQL)
$conexion = new mysqli("localhost", "root", "", "fisiowelfare");
if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error en la conexión a la BD."]));
}

// Recibir JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validar campos obligatorios
$obligatorios = ["tipo_documento","numero_documento","nombre","apellido","edad","rol","email","contrasena"];
foreach($obligatorios as $campo){
    if(empty($data[$campo])){
        echo json_encode(["success"=>false,"message"=>"El campo $campo es obligatorio."]);
        exit;
    }
}

// Verificar documento o email ya existente
$check = $conexion->prepare("SELECT id_usuario FROM usuarios WHERE numero_documento=? OR email=?");
$check->bind_param("ss",$data["numero_documento"],$data["email"]);
$check->execute();
$check->store_result();
if($check->num_rows>0){
    echo json_encode(["success"=>false,"message"=>"Ya existe un usuario con este documento o correo."]);
    exit;
}
$check->close();

// Encriptar contraseña - hash
$contrasenaHash = password_hash($data["contrasena"], PASSWORD_BCRYPT);

// Insertar usuario
$sql = "INSERT INTO usuarios (tipo_documento, numero_documento, nombre, apellido, edad, rol, email, contrasena, fecha_registro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssssisss",
    $data["tipo_documento"],
    $data["numero_documento"],
    $data["nombre"],
    $data["apellido"],
    $data["edad"],
    $data["rol"],
    $data["email"],
    $contrasenaHash
);

if($stmt->execute()){
    $_SESSION["usuario_id"] = $stmt->insert_id;
    $_SESSION["usuario_nombre"] = $data["nombre"];
    $_SESSION["usuario_rol"] = $data["rol"];

    // Redirección según rol
    switch($data["rol"]) {
        case "fisioterapeuta":
            $redirect = "../paginas/panelTerapeuta.html";
            break;
        case "admin":
            $redirect = "../paginas/panelAdministrador.html";
            break;
    }

    echo json_encode([
        "success" => true,
        "redirect" => $redirect
    ]);
} else {
    echo json_encode(["success"=>false,"message"=>"Error al registrar usuario: ".$stmt->error]);
}

$stmt->close();
$conexion->close();
?>
