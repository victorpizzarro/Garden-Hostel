<?php
/*
    Endpoint pra autenticar um usuário (Cliente, Atendente ou Admin)
    Método: POST
    Recebe: JSON { "email": "...", "senha": "..." }
    Retorna: JSON { "status": "sucesso", "tipo_usuario": "..." } ou { "status": "erro", ... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Pega os dados do JSON ($dadosRecebidos)
// O $dadosRecebidos já foi lido e decodificado no 'config.php'
$email = $dadosRecebidos['email'];
$senha = $dadosRecebidos['senha'];

// 3. Valida os dados
if (empty($email) || empty($senha)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Email e senha são obrigatórios.'
    ]);
    exit();
}

// 4. Lógica de Autenticação
$sql = "SELECT id, nome_completo, tipo_usuario 
        FROM Usuarios 
        WHERE email = '$email' AND senha = '$senha'";

$resultado = $conexao->query($sql);

// 5. Verifica o resultado
if ($resultado->num_rows > 0) {
    // --- Login com Sucesso ---
    
    // Pega os dados do usuário
    $usuario = $resultado->fetch_assoc();

    // Inicia a sessão (o session_start() está no config.php)
    // Armazena o ID real do banco e o tipo do usuário
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_tipo'] = $usuario['tipo_usuario'];
    $_SESSION['usuario_nome'] = $usuario['nome_completo'];

    // Retorna uma resposta de sucesso para o JavaScript
    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Login realizado com sucesso.',
        'tipo_usuario' => $usuario['tipo_usuario']
    ]);

} else {
    // --- Falha no Login ---
    
    // Limpa qualquer sessão antiga que possa existir
    session_unset();
    session_destroy();

    // Retorna uma resposta de erro (Usuário ou senha inválidos)
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Email ou senha inválidos.'
    ]);
}
?>