<?php
$servidor = "localhost";
$usuario = "root"; 
$senha = ""; 
$banco = "garden_db";

// Criando a conexão
$conn = mysqli_connect($servidor, $usuario, $senha, $banco);

// Verificando se deu certo
if (!$conn) {
    die("Falha na conexão: " . mysqli_connect_error());
}

?>
