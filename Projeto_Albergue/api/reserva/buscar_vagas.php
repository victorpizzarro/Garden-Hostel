<?php
/*
    Endpoint pra buscar vagas e quartos disponíveis em um período
    Método: GET
    Recebe: ?checkin=AAAA-MM-DD&checkout=AAAA-MM-DD
    Retorna: JSON [ { ...vaga1... }, { ...vaga2... } ]
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Pega os dados da URL (GET)
$data_checkin_str = $_GET['checkin'];
$data_checkout_str = $_GET['checkout'];

// 3. Valida os dados
if (empty($data_checkin_str) || empty($data_checkout_str)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Datas de check-in e check-out são obrigatórias.'
    ]);
    exit();
}

// 4. Aplica a Regra de Negócio: Check-in/Check-out ao Meio-dia (12:00)
$data_checkin = $data_checkin_str . ' 12:00:00';
$data_checkout = $data_checkout_str . ' 12:00:00';


// 5. Lógica de Busca

/* 
    O objetivo é encontrar vagas que não estejam ocupadas no período
    que o cliente pediu
    
    O SQL faz isso em duas partes:
    
    1. O 'SELECT' principal (de 'Vagas' e 'Quartos') pega todas as vagas
    que existem no albergue
    
    2. A parte 'WHERE v.id NOT IN (...)' filtra essa lista, removendo
    as vagas que a sub-query encontrar
    
    3. A SUB-QUERY (o 'SELECT' dentro do 'NOT IN') cria a "lista de vagas ocupadas"
    Uma vaga é considerada ocupada se ela cumpre duas condições:
    
    Condição A: A reserva da vaga está ATIVA
    (São ignoradas as reservas que já foram 'CANCELADA' ou 'FINALIZADA')
    
    Condição B: As datas dessa reserva ATIVA "cruzam" com o período
    que o cliente está pedindo
*/

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

                -- E

                -- CONDIÇÃO B: As datas da reserva (r) cruzam com as datas pedidas
                -- (A reserva existente começa ANTES que a nova termine E
                --  a reserva existente termina DEPOIS que a nova comece)
                AND (r.data_checkin < '$data_checkout' AND r.data_checkout > '$data_checkin')
        )
    ORDER BY 
        q.preco_diaria ASC, v.id ASC
";

$resultado = $conexao->query($sql);
$vagas_disponiveis = [];

if ($resultado->num_rows > 0) {
    // Loop pra pegar todas as vagas encontradas
    while ($linha = $resultado->fetch_assoc()) {
        $vagas_disponiveis[] = $linha;
    }
}

// 6. Retorna a lista de vagas (pode ser vazia)
http_response_code(200);
echo json_encode($vagas_disponiveis);
?>