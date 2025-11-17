<?php
/*
    Endpoint para buscar TODOS os dados de um cliente logado
    Método: GET
    Recebe: (Sessão)
    Retorna: JSON { ...dados do usuário e endereço... }
*/


require_once '../config.php';


if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'CLIENTE') {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$cliente_id = $_SESSION['usuario_id'];


$sql = "SELECT 
            u.nome_completo,
            u.email,
            u.documento_numero,
            u.data_nascimento,
            u.telefone_celular,
            e.cep,
            e.logradouro,
            e.numero,
            e.complemento,
            e.bairro,
            e.cidade,
            e.estado
        FROM 
            Usuarios AS u
        LEFT JOIN 
            Enderecos AS e ON u.id = e.fk_usuario_id
        WHERE 
            u.id = $cliente_id";

$resultado = $conexao->query($sql);

if ($resultado && $resultado->num_rows > 0) {
    $perfil = $resultado->fetch_assoc();
    http_response_code(200);
    echo json_encode($perfil);
} else {
    http_response_code(404);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Perfil não encontrado.']);
}
?>