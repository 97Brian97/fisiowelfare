<?php
session_start();

if (isset($_SESSION['id_usuario']) || isset($_SESSION['id_paciente'])) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode([
        'success' => false,
        'redirect' => '../paginas/Login.html'
    ]);
}
?>