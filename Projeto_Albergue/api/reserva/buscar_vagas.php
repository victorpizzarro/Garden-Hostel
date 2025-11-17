<?php
/*
  Endpoint pra buscar vagas e quartos disponíveis em um período
  Método: GET
  Recebe: ?checkin=AAAA-MM-DD&checkout=AAAA-MM-DD
  Versão 2.0 - Corrigida (sem colunas fantasma) e Segura (Prepared Statements)
*/


require_once '../config.php';


$data_checkin_str = $_GET['checkin'];
$data_checkout_str = $_GET['checkout'];


if (empty($data_checkin_str) || empty($data_checkout_str)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Datas de check-in e check-out são obrigatórias.'
    ]);
    exit();
}

// Aplica a Regra de Negócio: Check-in/Check-out ao Meio-dia (12:00)
// Usamos '?' como placeholders para o prepared statement
$data_checkin = $data_checkin_str . ' 12:00:00';
$data_checkout = $data_checkout_str . ' 12:00:00';


// Lógica de Busca (Segura com Prepared Statements)
$sql = "
    SELECT 
        v.id AS vaga_id,
        v.nome_identificador,
        v.descricao_peculiaridades_pt,
        v.descricao_peculiaridades_en,
        q.id AS quarto_id,
        q.nome AS quarto_nome,
        q.descricao_pt AS quarto_descricao_pt,
        q.descricao_en AS quarto_descricao_en,
        q.tipo AS quarto_tipo,
        q.capacidade AS quarto_capacidade,
        q.tem_banheiro AS quarto_tem_banheiro,
        q.preco_diaria
    FROM 
        Vagas AS v
    JOIN 
        Quartos AS q ON v.fk_quarto_id = q.id
    WHERE 
        v.id NOT IN (
            -- Início da Sub-Query (Lista de Vagas Ocupadas)
            SELECT 
                rv.fk_vaga_id
            FROM 
                Reservas_Vagas AS rv
            JOIN 
                Reservas AS r ON rv.fk_reserva_id = r.id
            WHERE 
                -- CONDIÇÃO A: A reserva deve estar ativa
                r.status_reserva NOT IN ('CANCELADA', 'FINALIZADA')
                -- CONDIÇÃO B: Conflito de datas
                AND (r.data_checkin < ? AND r.data_checkout > ?)
        )
    ORDER BY 
        q.preco_diaria ASC, v.id ASC
";

// Prepara a consulta
$stmt = $conexao->prepare($sql);

// "ss" = string, string (para $data_checkout e $data_checkin)
$stmt->bind_param("ss", $data_checkout, $data_checkin);

// Executa a consulta
$stmt->execute();
$resultado = $stmt->get_result();
$vagas_disponiveis = [];

if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $linha['quarto_tem_banheiro'] = (bool)$linha['quarto_tem_banheiro'];
        $vagas_disponiveis[] = $linha;
    }
}

// 6. Retorna a lista de vagas (pode ser vazia)
http_response_code(200);
echo json_encode($vagas_disponiveis);

$stmt->close();
$conexao->close();
?>