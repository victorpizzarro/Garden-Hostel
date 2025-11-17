<?php
/*
    Endpoint pra autenticar um usuário (Cliente, Atendente ou Admin)
    Método: POST
    Recebe: JSON { "email": "...", "senha": "..." }
    Retorna: JSON { "status": "sucesso", "tipo_usuario": "..." } ou { "status": "erro", ... }
*/


require_once '../config.php';


$email = $dadosRecebidos['email'];
$senha = $dadosRecebidos['senha'];


if (empty($email) || empty($senha)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Email e senha são obrigatórios.'
    ]);
    exit();
}


$sql = "SELECT id, nome_completo, tipo_usuario 
        FROM Usuarios 
        WHERE email = '$email' AND senha = '$senha'";

$resultado = $conexao->query($sql);


if ($resultado->num_rows > 0) {
    
    
    
    $usuario = $resultado->fetch_assoc();

    
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_tipo'] = $usuario['tipo_usuario'];
    $_SESSION['usuario_nome'] = $usuario['nome_completo'];

   
    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Login realizado com sucesso.',
        'tipo_usuario' => $usuario['tipo_usuario']
    ]);

} else {
 
    
   
    session_unset();
    session_destroy();

    
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Email ou senha inválidos.'
    ]);
}
?>