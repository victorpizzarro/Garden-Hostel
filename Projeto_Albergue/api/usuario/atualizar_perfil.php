<?php
/*
    Endpoint pro CLIENTE atualizar seus próprios dados
    Método: POST
    Recebe: JSON { ...dados... }
    (Ex: { "telefone_celular": "...", "nova_senha": "...", "senha_antiga": "..." })
    (Ex: { "endereco": { "cep": "...", "logradouro": "..." } })
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
*/


require_once '../config.php';


if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'CLIENTE') {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Você precisa estar logado como cliente.'
    ]);
    exit();
}


$cliente_id = $_SESSION['usuario_id'];


$conexao->begin_transaction();

try {
    
    
    $campos_usuario = [];
    $celular = isset($dadosRecebidos['telefone_celular']) ? $dadosRecebidos['telefone_celular'] : null;
    $senha_antiga = isset($dadosRecebidos['senha_antiga']) ? $dadosRecebidos['senha_antiga'] : null;
    $nova_senha = isset($dadosRecebidos['nova_senha']) ? $dadosRecebidos['nova_senha'] : null;

    
    if ($celular !== null) {
        $campos_usuario[] = "telefone_celular = '$celular'";
    }

    
    if ($nova_senha !== null) {
        if (empty($senha_antiga)) {
            throw new Exception('Para definir uma nova senha, a senha antiga é obrigatória.');
        }

        
        $sql_check_senha = "SELECT senha FROM Usuarios WHERE id = $cliente_id AND senha = '$senha_antiga'";
        $result_check = $conexao->query($sql_check_senha);

        if ($result_check->num_rows == 0) {
            throw new Exception('Senha antiga incorreta.');
        }
        
        
        $campos_usuario[] = "senha = '$nova_senha'";
    }

    
    if (count($campos_usuario) > 0) {
        $sql_update_usuario = "UPDATE Usuarios SET " . implode(', ', $campos_usuario) . " WHERE id = $cliente_id";
        
        if (!$conexao->query($sql_update_usuario)) {
            throw new Exception('Erro ao atualizar dados do usuário: ' . $conexao->error);
        }
    }

    
    if (isset($dadosRecebidos['endereco'])) {
        $end = $dadosRecebidos['endereco']; // Array de endereço

        
        $sql_endereco = "UPDATE Enderecos SET
                            cep = '{$end['cep']}',
                            logradouro = '{$end['logradouro']}'
                            
                         WHERE fk_usuario_id = $cliente_id";
        
        if (!$conexao->query($sql_endereco)) {
             throw new Exception('Erro ao atualizar endereço: ' . $conexao->error);
        }
        
        
        if ($conexao->affected_rows == 0) {
            
            
            $sql_insert_endereco = "INSERT INTO Enderecos 
                                        (fk_usuario_id, cep, logradouro)
                                    VALUES 
                                        ($cliente_id, '{$end['cep']}', '{$end['logradouro']}')";
            
            if (!$conexao->query($sql_insert_endereco)) {
                throw new Exception('Erro ao inserir novo endereço: ' . $conexao->error);
            }
        }
    }

    
    $conexao->commit();

    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Perfil atualizado com sucesso.'
    ]);

} catch (Exception $e) {
    
    $conexao->rollback();
    
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>