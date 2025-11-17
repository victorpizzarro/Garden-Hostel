<?php
/**
 * Arquivo: api/admin/recepcao.php
 * Descrição: Endpoint para operações da recepção
 */

require_once '../config.php';

// Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}


$acao = isset($_GET['acao']) ? $_GET['acao'] : '';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    if (isset($_POST['acao'])) {
        $acao = $_POST['acao'];
    } else {
        
        $json = file_get_contents('php://input');
        $dadosRecebidos = json_decode($json, true);
        $acao = isset($dadosRecebidos['acao']) ? $dadosRecebidos['acao'] : '';
    }
} else {
   
    $acao = isset($_GET['acao']) ? $_GET['acao'] : '';
}


if (isset($_POST['reserva_id'])) {
    $reserva_id_post = $_POST['reserva_id'];
}

try {
    switch($acao) {
        case 'checkins_pendentes':
            listarCheckinsPendentes();
            break;
        case 'hospedes_ativos':
            listarHospedesAtivos();
            break;
        case 'saldo_devedor':
            buscarSaldoDevedor();
            break;
        case 'fazer_checkin':
            fazerCheckin();
            break;
        case 'fazer_checkout':
            fazerCheckout();
            break;
        default:
            throw new Exception('Ação não especificada.');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}

function listarCheckinsPendentes() {
    global $conexao;
    
    $sql = "SELECT r.id, r.data_checkin, r.data_checkout, r.status_reserva as status,
                   u.nome_completo as nome_cliente, u.email as email_cliente, 
                   u.documento_numero as documento_cliente,
                   q.nome as nome_quarto
            FROM Reservas r
            LEFT JOIN Usuarios u ON r.fk_cliente_id = u.id
            LEFT JOIN Reservas_Vagas rv ON r.id = rv.fk_reserva_id
            LEFT JOIN Vagas v ON rv.fk_vaga_id = v.id
            LEFT JOIN Quartos q ON v.fk_quarto_id = q.id
            WHERE r.status_reserva = 'CONFIRMADA'
            AND DATE(r.data_checkin) <= CURDATE()
            GROUP BY r.id
            ORDER BY r.data_checkin ASC";
    
    $result = $conexao->query($sql);
    $reservas = [];
    
    while ($linha = $result->fetch_assoc()) {
        $reservas[] = $linha;
    }
    
    echo json_encode($reservas);
}

function listarHospedesAtivos() {
    global $conexao;
    
    $sql = "SELECT r.id, r.data_checkin, r.data_checkout, r.status_reserva as status,
                   u.nome_completo as nome_cliente, u.email as email_cliente, 
                   u.documento_numero as documento_cliente,
                   q.nome as nome_quarto, v.nome_identificador as nome_vaga
            FROM Reservas r
            LEFT JOIN Usuarios u ON r.fk_cliente_id = u.id
            LEFT JOIN Reservas_Vagas rv ON r.id = rv.fk_reserva_id
            LEFT JOIN Vagas v ON rv.fk_vaga_id = v.id
            LEFT JOIN Quartos q ON v.fk_quarto_id = q.id
            WHERE r.status_reserva = 'CHECKIN'
            AND DATE(r.data_checkout) >= CURDATE()
            GROUP BY r.id
            ORDER BY r.data_checkout ASC";
    
    $result = $conexao->query($sql);
    $reservas = [];
    
    while ($linha = $result->fetch_assoc()) {
        $reservas[] = $linha;
    }
    
    echo json_encode($reservas);
}

function buscarSaldoDevedor() {
    global $conexao;
    
    $reserva_id = isset($_GET['reserva_id']) ? $_GET['reserva_id'] : '';
    
    if (empty($reserva_id)) {
        throw new Exception('ID da reserva não fornecido.');
    }
    
    
    $sql = "SELECT valor_total_diarias as valor_total 
            FROM Reservas 
            WHERE id = ?";
    
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $reserva_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $reserva = $result->fetch_assoc();
    
    $stmt->close();
    
    if ($reserva) {
        
        $saldo = $reserva['valor_total'] * 0.8;
        echo json_encode(['saldo' => $saldo]);
    } else {
        echo json_encode(['saldo' => 0]);
    }
}

function fazerCheckin() {
    global $conexao, $dadosRecebidos;
    
    
    if (isset($GLOBALS['reserva_id_post'])) {
        $reserva_id = $GLOBALS['reserva_id_post'];
    } else {
        $reserva_id = $dadosRecebidos['reserva_id'] ?? '';
    }
    
    if (empty($reserva_id)) {
        throw new Exception('ID da reserva não fornecido.');
    }
    
    $sql = "UPDATE Reservas SET status_reserva = 'CHECKIN' WHERE id = ? AND status_reserva = 'CONFIRMADA'";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $reserva_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Check-in realizado com sucesso.']);
        } else {
            throw new Exception('Check-in falhou. Reserva não encontrada ou não está com status "CONFIRMADA".');
        }
    } else {
        throw new Exception('Erro ao realizar check-in: ' . $stmt->error);
    }
    
    $stmt->close();
}

function fazerCheckout() {
    global $conexao, $dadosRecebidos;
    
    
    if (isset($GLOBALS['reserva_id_post'])) {
        $reserva_id = $GLOBALS['reserva_id_post'];
    } else {
        $reserva_id = $dadosRecebidos['reserva_id'] ?? '';
    }
    
    if (empty($reserva_id)) {
        throw new Exception('ID da reserva não fornecido.');
    }
    
    $sql = "UPDATE Reservas SET status_reserva = 'FINALIZADA' WHERE id = ? AND status_reserva = 'CHECKIN'";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $reserva_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Check-out realizado com sucesso.']);
        } else {
            throw new Exception('Check-out falhou. Reserva não encontrada ou não está com status "CHECKIN".');
        }
    } else {
        throw new Exception('Erro ao realizar check-out: ' . $stmt->error);
    }
    
    $stmt->close();
}