<?php
/**
 * Arquivo: api/admin/imprimir_ficha.php
 * Descrição: Endpoint para buscar os dados de uma reserva para impressão (RF11).
 * Método: GET
 * Recebe: ?reserva_id=X
 * Retorna: JSON { ...dados da reserva e do usuário... }
 */

/*
    Endpoint pra buscar os dados de uma reserva para impressão
    Método: GET
    Recebe: ?reserva_id=X
    Retorna: JSON { ...dados da reserva e do usuário... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário está logado (como Atendente ou Admin)
if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

// 3. Pega os dados da URL
if (!isset($_GET['reserva_id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da reserva não fornecido.']);
    exit();
}
$reserva_id = $_GET['reserva_id'];

// 4. Busca os dados (Reserva + Usuário + Endereço)
$sql = "SELECT 
            r.id AS reserva_num,
            r.data_checkin,
            r.data_checkout,
            u.nome_completo,
            u.documento_tipo,
            u.documento_numero,
            u.data_nascimento,
            u.telefone_celular,
            u.email,
            e.logradouro,
            e.numero,
            e.bairro,
            e.cidade,
            e.estado,
            e.cep
        FROM 
            Reservas AS r
        JOIN 
            Usuarios AS u ON r.fk_cliente_id = u.id
        LEFT JOIN 
            Enderecos AS e ON u.id = e.fk_usuario_id
        WHERE 
            r.id = $reserva_id";

$resultado = $conexao->query($sql);

// 5. Verifica o resultado
if ($resultado->num_rows == 0) {
    http_response_code(404); // Not Found
    echo json_encode(['status' => 'erro', 'mensagem' => 'Reserva não encontrada.']);
    exit();
}

$dados = $resultado->fetch_assoc();

// 6. Retorna os dados como JSON
http_response_code(200);
echo json_encode($dados);
?>