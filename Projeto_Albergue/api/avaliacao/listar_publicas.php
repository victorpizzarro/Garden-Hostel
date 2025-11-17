<?php
/*
    Endpoint pra listar avaliações APROVADAS
    Método: GET
    Recebe: Nada
    Retorna: JSON [ { ...avaliacao1... }, { ...avaliacao2... } ]
*/


require_once '../config.php';


// Procura as avaliações APROVADAS
// Também faz um JOIN com a tabela Usuarios pra pegar o nome
// do cliente que fez a avaliação.
$sql = "SELECT 
            a.nota,
            a.comentario,
            a.created_at,
            u.nome_completo AS cliente_nome
        FROM 
            Avaliacoes AS a
        JOIN 
            Usuarios AS u ON a.fk_cliente_id = u.id
        WHERE 
            a.status_moderacao = 'APROVADO'
        ORDER BY 
            a.created_at DESC
        LIMIT 5"; // Pega só as 5 mais recentes para a página inicial

$resultado = $conexao->query($sql);
$avaliacoes = [];

if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $avaliacoes[] = $linha;
    }
}


http_response_code(200);
echo json_encode($avaliacoes);
?>