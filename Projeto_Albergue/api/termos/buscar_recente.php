<?php
/*
    ndpoint pra buscar a versão mais recente dos Termos
    Método: POST
    Recebe: Nada
    Retorna: JSON { ...dados do termo... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Lógica de Busca
// Busca o termo com a maior versão (o mais recente)
$sql = "SELECT 
            id AS termo_id,
            titulo,
            conteudo_pt,
            conteudo_en,
            versao
        FROM 
            Termos_Regras
        ORDER BY 
            versao DESC
        LIMIT 1"; // Garante que pegou apenas o último

$resultado = $conexao->query($sql);

// 3. Verifica o resultado
if ($resultado->num_rows > 0) {
    $termo = $resultado->fetch_assoc();
    http_response_code(200);
    echo json_encode($termo);
} else {
    // Isso só acontece se a tabela 'Termos_Regras' estiver vazia
    http_response_code(404);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Nenhum termo de uso encontrado.'
    ]);
}
?>