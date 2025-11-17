<?php
/*
    Endpoint pra cadastrar um novo usuário (CLIENTE) de forma simplificada.
    Usado no modal de reserva quando o usuário não tem conta.
    Método: POST
    Recebe: JSON { "nome_completo": "...", "email": "...", "senha": "..." }
    Retorna: JSON { "status": "sucesso", "id_usuario": "..." } ou { "status": "erro", ... }
*/


require_once '../config.php';


$nome = $dadosRecebidos['nome_completo'];
$email = $dadosRecebidos['email'];
$senha = $dadosRecebidos['senha'];


if (empty($nome) || empty($email) || empty($senha)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Nome, email e senha são obrigatórios.'
    ]);
    exit();
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Formato de email inválido.'
    ]);
    exit();
}


$conexao->begin_transaction();

try {
    

    $doc_tipo = 'CPF';
    $doc_num = '00000000000'; 
    $data_nasc = '2000-01-01'; 
    $celular = '00000000000'; 
    $tipo_usuario = 'CLIENTE';

    $sql_usuario = "INSERT INTO Usuarios 
                        (nome_completo, email, senha, documento_tipo, documento_numero, data_nascimento, telefone_celular, tipo_usuario)
                    VALUES 
                        ('$nome', '$email', '$senha', '$doc_tipo', '$doc_num', '$data_nasc', '$celular', '$tipo_usuario')";

    if (!$conexao->query($sql_usuario)) {
        
        $erro = $conexao->error;
        if (strpos($erro, 'email') !== false || strpos($erro, 'Duplicate entry') !== false) {
            throw new Exception('Este email já está cadastrado.');
        }
        throw new Exception('Erro ao cadastrar usuário: ' . $erro);
    }

    
    $novo_usuario_id = $conexao->insert_id;

    
    $sql_endereco = "INSERT INTO Enderecos 
                        (fk_usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado)
                     VALUES 
                        ($novo_usuario_id, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
    
    if (!$conexao->query($sql_endereco)) {
        
        throw new Exception('Erro ao cadastrar endereço: ' . $conexao->error);
    }

    
    $conexao->commit();
    
    http_response_code(201); // 201 Created
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Usuário cadastrado com sucesso.',
        'id_usuario' => $novo_usuario_id
    ]);

} catch (Exception $e) {
    
    $conexao->rollback();
    
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>

