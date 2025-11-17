<?php
/*
    Endpoint para listar quartos disponíveis para exibição no home
    Método: GET
    Retorna: JSON [ { ...quarto1... }, { ...quarto2... } ]
    Mostra quartos que estão disponíveis (data_entrada <= hoje e (data_saida IS NULL ou data_saida >= hoje))
*/


require_once '../config.php';


// Um quarto está disponível se:
// - data_entrada é NULL ou <= hoje (já está disponível)
// - data_saida é NULL (indefinido) ou >= hoje (ainda está disponível)
$hoje = date('Y-m-d');

$sql = "
    SELECT 
        q.id,
        q.nome,
        q.descricao_pt,
        q.descricao_en,
        q.capacidade,
        q.tem_banheiro,
        q.preco_diaria,
        q.data_entrada,
        q.data_saida,
        COUNT(v.id) AS total_vagas
    FROM 
        Quartos AS q
    LEFT JOIN 
        Vagas AS v ON q.id = v.fk_quarto_id
    WHERE 
        (q.data_entrada IS NULL OR DATE(q.data_entrada) <= '$hoje')
        AND
        (q.data_saida IS NULL OR DATE(q.data_saida) >= '$hoje')
    GROUP BY 
        q.id
    ORDER BY 
        q.preco_diaria ASC, q.nome ASC
";

$resultado = $conexao->query($sql);
$quartos = [];

if ($resultado) {
    while ($linha = $resultado->fetch_assoc()) {
        $quartos[] = $linha;
    }
}

// 3. Retorna a lista de quartos
http_response_code(200);
echo json_encode($quartos);
?>

