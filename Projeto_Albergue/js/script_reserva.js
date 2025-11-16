/**
 * Arquivo: /js/script_reserva.js
 * Descrição: Lógica da Página de Reserva (reserva.html)
 * (Versão 2.0 - Com Seletor de Quantidade e Modal de Login)
 */

// ========================================================================
// DICIONÁRIO DE IDIOMAS (RF10)
// ========================================================================
const dicionarioTextos = {
    'pt': {
        'saudacao': 'Olá', 'btn-sair': '(Sair)', 'label-checkin': 'Check-in', 'label-checkout': 'Check-out',
        'reserva-passo1': 'Escolha a Acomodação', 'reserva-passo2': 'Confirmação e Pagamento',
        'reserva-buscando': 'Buscando acomodações para o período...',
        'reserva-nenhuma-vaga': 'Desculpe, não há vagas disponíveis para o período selecionado.',
        'pagamento-titulo': 'Método de pagamento', 'pagamento-cartao': 'Cartões de crédito',
        'pagamento-titular': 'Titular', 'pagamento-cpf': 'CPF/CNPJ', 'pagamento-numero': 'Número do Cartão',
        'pagamento-validade': 'Validade (MM/AA)', 'pagamento-cvv': 'Código (CVV)',
        'resumo-titulo': 'Sua reserva', 'resumo-quarto': 'Quarto', 'resumo-vagas': 'Vagas',
        'resumo-total': 'Total geral', 'resumo-checkin': 'Check-in', 'resumo-checkout': 'Check-out',
        'termos-texto-1': 'Eu li e aceito os', 'termos-link': 'Termos e Regras',
        'reserva-btn-confirmar': 'Confirmar Pagamento',
        'reserva-btn-reservar': 'Reservar Agora',
        'erro-termos': 'Você deve aceitar os termos.',
        'erro-login-necessario': 'Login necessário',
        'erro-login-texto': 'Você precisa fazer o login ou criar uma conta para continuar sua reserva.',
        'resumo-vazio': 'Selecione uma ou mais vagas na lista ao lado.',
        'card-vagas': 'Vagas Livres', 'card-selecionar': 'Quantas vagas?',
        // (Textos do Modal de Login - copiados do script_auth.js)
        'login-titulo': 'Acessar minha conta', 'login-email': 'Email', 'login-senha': 'Senha',
        'login-btn-entrar': 'Entrar', 'login-nao-tem-conta': 'Ainda não tem conta?', 'login-cadastre': 'Cadastre-se aqui',
        'reg-titulo': 'Criar nova conta', 'reg-nome': 'Nome Completo', 'reg-email': 'Email', 'reg-senha': 'Senha',
        'reg-btn-criar': 'Criar Conta', 'reg-ja-tem-conta': 'Já tem uma conta?', 'reg-faca-login': 'Faça o login aqui'
    },
    'en': {
        // (Traduções em Inglês)
        'saudacao': 'Hello', 'btn-sair': '(Logout)', 'label-checkin': 'Check-in', 'label-checkout': 'Check-out',
        'reserva-passo1': 'Choose Accommodation', 'reserva-passo2': 'Confirmation & Payment',
        'reserva-buscando': 'Searching for accommodations...',
        'reserva-nenhuma-vaga': 'Sorry, there are no vacancies for the selected period.',
        'pagamento-titulo': 'Payment Method', 'pagamento-cartao': 'Credit cards',
        'pagamento-titular': 'Cardholder Name', 'pagamento-cpf': 'Document (CPF/CNPJ)',
        'pagamento-numero': 'Card Number', 'pagamento-validade': 'Expiry (MM/YY)', 'pagamento-cvv': 'Code (CVV)',
        'resumo-titulo': 'Your reservation', 'resumo-quarto': 'Room', 'resumo-vagas': 'Beds',
        'resumo-total': 'Grand total', 'resumo-checkin': 'Check-in', 'resumo-checkout': 'Check-out',
        'termos-texto-1': 'I have read and accept the', 'termos-link': 'Terms and Rules',
        'reserva-btn-confirmar': 'Confirm Payment',
        'reserva-btn-reservar': 'Book Now',
        'erro-termos': 'You must accept the terms.',
        'erro-login-necessario': 'Login Required',
        'erro-login-texto': 'You need to log in or create an account to continue your reservation.',
        'resumo-vazio': 'Select one or more beds from the list on the left.',
        'card-vagas': 'Available Beds', 'card-selecionar': 'How many beds?',
        'login-titulo': 'Access my account', 'login-email': 'Email', 'login-senha': 'Password',
        'login-btn-entrar': 'Login', 'login-nao-tem-conta': "Don't have an account?", 'login-cadastre': 'Register here',
        'reg-titulo': 'Create new account', 'reg-nome': 'Full Name', 'reg-email': 'Email', 'reg-senha': 'Password',
        'reg-btn-criar': 'Create Account', 'reg-ja-tem-conta': 'Already have an account?', 'reg-faca-login': 'Login here'
    }
};

// ========================================================================
// SCRIPT PRINCIPAL
// ========================================================================

let idiomaAtual = localStorage.getItem('idioma') || 'pt';
let termoIdAtual = null;

// Guarda os dados da reserva (o "carrinho")
let carrinho = {
    vagas_ids: [],
    quarto_nome: '',
    valor_total: 0,
    checkin: '',
    checkout: '',
    qtd_vagas: 0,
    preco_unidade: 0
};

/**
 * Funções Globais (Tradução e Erro)
 */
function aplicarTraducoes() {
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (dicionarioTextos[idiomaAtual][key]) {
            elem.innerText = dicionarioTextos[idiomaAtual][key];
        }
    });
    document.body.classList.add('js-traduzido');
}
function mostrarErro(mensagemKey) {
    const msgElement = document.getElementById('reserva-message');
    const msgTraduzida = dicionarioTextos[idiomaAtual][mensagemKey] || mensagemKey;
    msgElement.innerText = msgTraduzida;
    msgElement.style.display = 'block';
}
function limparErro() {
    document.getElementById('reserva-message').style.display = 'none';
}

/**
 * Função: carregarVagasDisponiveis
 * Descrição: Busca na API as vagas para as datas selecionadas
 */
function carregarVagasDisponiveis() {
    const listaContainer = document.getElementById('lista-quartos-disponiveis');
    listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['reserva-buscando']}</p>`;
    
    carrinho = {}; // Limpa o carrinho
    atualizarResumo(); // Limpa o resumo
    
    const checkin = document.getElementById('reserva-checkin').value;
    const checkout = document.getElementById('reserva-checkout').value;
    
    // Guarda as datas no carrinho
    carrinho.checkin = checkin;
    carrinho.checkout = checkout;

    fetch(`api/reserva/buscar_vagas.php?checkin=${checkin}&checkout=${checkout}`)
        .then(response => response.json())
        .then(data => {
            listaContainer.innerHTML = ''; 
            
            if (data.status === 'erro' || data.length === 0) {
                listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['reserva-nenhuma-vaga']}</p>`;
                return;
            }
            
            // --- Agrupa as vagas por Quarto ---
            const quartos = {};
            data.forEach(vaga => {
                if (!quartos[vaga.quarto_id]) {
                    quartos[vaga.quarto_id] = {
                        id: vaga.quarto_id,
                        nome: (idiomaAtual === 'en') ? vaga.quarto_descricao_en : vaga.quarto_descricao_pt,
                        preco: vaga.preco_diaria,
                        capacidade: vaga.quarto_capacidade,
                        tem_banheiro: vaga.quarto_tem_banheiro,
                        vagas: [] // Lista de IDs de vagas livres
                    };
                }
                quartos[vaga.quarto_id].vagas.push(vaga.vaga_id);
            });

            // --- Constrói o HTML dos Cards de Quarto ---
            for (const quartoId in quartos) {
                const quarto = quartos[quartoId];
                
                // Cria o <select> de quantidade
                let selectHTML = `<select class="quarto-select-vagas" 
                                    data-quarto-id="${quarto.id}"
                                    data-nome="${quarto.nome}"
                                    data-preco="${quarto.preco}"
                                    data-vagas-disponiveis="${quarto.vagas.join(',')}"
                                 >`;
                selectHTML += `<option value="0">0 ${dicionarioTextos[idiomaAtual]['resumo-vagas']}</option>`;
                for (let i = 1; i <= quarto.vagas.length; i++) {
                    selectHTML += `<option value="${i}">${i} ${dicionarioTextos[idiomaAtual]['resumo-vagas']}</option>`;
                }
                selectHTML += `</select>`;
                
                const card = document.createElement('div');
                card.className = 'quarto-card';
                card.innerHTML = `
                    <img src="imagens/quarto-${quarto.capacidade}-camas.jpg" alt="${quarto.nome}" class="quarto-img">
                    <div class="quarto-info">
                        <h3>${quarto.nome}</h3>
                        <div class="quarto-detalhes">
                            <span>Capacidade: ${quarto.capacidade}</span>
                            <span>${dicionarioTextos[idiomaAtual]['card-vagas']}: ${quarto.vagas.length}</span>
                        </div>
                    </div>
                    <div class="quarto-preco">
                        <span class="preco">R$ ${quarto.preco}</span>
                        <p class="preco-label">/ ${dicionarioTextos[idiomaAtual]['resumo-vagas']}</p>
                        <div class="quarto-quantidade">
                            <label>${dicionarioTextos[idiomaAtual]['card-selecionar']}</label>
                            ${selectHTML}
                        </div>
                    </div>
                `;
                listaContainer.appendChild(card);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar vagas:', error);
            listaContainer.innerHTML = `<p>Erro de conexão com a API.</p>`;
        });
}

/**
 * Função: atualizarResumo
 * Descrição: Chamada toda vez que o usuário muda o <select> de vagas
 */
function atualizarResumo() {
    const resumoContainer = document.getElementById('resumo-quarto-selecionado');
    const btnAcao = document.getElementById('btn-acao-principal');
    
    if (carrinho.qtd_vagas > 0) {
        // Tem itens no carrinho
        resumoContainer.innerHTML = `
            <p><strong>${dicionarioTextos[idiomaAtual]['resumo-quarto']}:</strong> <span>${carrinho.quarto_nome}</span></p>
            <p><strong>${dicionarioTextos[idiomaAtual]['resumo-vagas']}:</strong> <span>${carrinho.qtd_vagas}</span></p>
            <p><strong>${dicionarioTextos[idiomaAtual]['resumo-total']}:</strong> <span id="resumo-valor-total">R$ ${carrinho.valor_total.toFixed(2)}</span></p>
        `;
        btnAcao.disabled = false; // Habilita o botão
        btnAcao.innerText = dicionarioTextos[idiomaAtual]['reserva-btn-reservar'];
    } else {
        // Carrinho vazio
        resumoContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['resumo-vazio']}</p>`;
        btnAcao.disabled = true; // Desabilita o botão
        btnAcao.innerText = dicionarioTextos[idiomaAtual]['reserva-btn-reservar'];
    }
}

/**
 * Função: avancarParaPasso2
 * Descrição: Esconde o Passo 1, mostra o Passo 2 e atualiza o resumo/botões
 */
function avancarParaPasso2() {
    // 1. Troca os passos (esconde/mostra)
    document.getElementById('passo-1-selecao').classList.add('hidden');
    document.getElementById('passo-2-confirmacao').classList.remove('hidden');
    
    // 2. Atualiza o "Stepper"
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.add('active');

    // 3. Mostra o checkbox de Termos (RF09)
    document.getElementById('bloco-termos').classList.remove('hidden');
    
    // 4. Muda o texto do botão principal
    document.getElementById('btn-acao-principal').innerText = dicionarioTextos[idiomaAtual]['reserva-btn-confirmar'];
    
    // 5. Preenche o Resumo do Checkout
    document.getElementById('resumo-quarto-nome').innerText = carrinho.quarto_nome;
    document.getElementById('resumo-vagas-qtd').innerText = carrinho.qtd_vagas;
    document.getElementById('resumo-valor-total').innerText = `R$ ${carrinho.valor_total.toFixed(2)}`;
    document.getElementById('resumo-checkin').innerText = carrinho.checkin;
    document.getElementById('resumo-checkout').innerText = carrinho.checkout;
}

// "Ouve" o evento de que a página HTML foi 100% carregada
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lógica de Idioma (OnLoad) ---
    aplicarTraducoes(); 
    
    const btnPt = document.getElementById('btn-lang-pt');
    const btnEn = document.getElementById('btn-lang-en');

    if (idiomaAtual === 'en') {
        btnEn.classList.add('active');
        btnPt.classList.remove('active');
    } else {
        btnPt.classList.add('active');
        btnEn.classList.remove('active');
    }

    btnPt.addEventListener('click', () => {
        idiomaAtual = 'pt'; localStorage.setItem('idioma', 'pt');
        aplicarTraducoes(); carregarVagasDisponiveis();
    });
    btnEn.addEventListener('click', () => {
        idiomaAtual = 'en'; localStorage.setItem('idioma', 'en');
        aplicarTraducoes(); carregarVagasDisponiveis();
    });

    // --- 2. Lógica de Carregamento Inicial ---
    const inputCheckin = document.getElementById('reserva-checkin');
    const inputCheckout = document.getElementById('reserva-checkout');

    const urlParams = new URLSearchParams(window.location.search);
    const checkinURL = urlParams.get('checkin');
    const checkoutURL = urlParams.get('checkout');

    if (checkinURL && checkoutURL) {
        inputCheckin.value = checkinURL;
        inputCheckout.value = checkoutURL;
    }

    // Busca os Termos de Uso (RF09)
    fetch('api/termos/buscar_recente.php')
        .then(r => r.json())
        .then(termo => {
            termoIdAtual = termo.termo_id; 
        });

    // Carrega as vagas do Passo 1
    carregarVagasDisponiveis();
    
    // --- 3. Lógica: Mudar as datas (RF01 - Melhoria) ---
    inputCheckin.addEventListener('change', carregarVagasDisponiveis);
    inputCheckout.addEventListener('change', carregarVagasDisponiveis);
    
    // --- 4. Lógica: Selecionar Vagas (Passo 1) ---
    document.getElementById('lista-quartos-disponiveis').addEventListener('change', (e) => {
        // Se o usuário mudou um <select> de vagas
        if (e.target.classList.contains('quarto-select-vagas')) {
            const select = e.target;
            const qtd = parseInt(select.value);
            const preco = parseFloat(select.getAttribute('data-preco'));
            const vagasDisponiveis = select.getAttribute('data-vagas-disponiveis').split(',');

            // Pega as X primeiras vagas da lista
            const vagasSelecionadas = vagasDisponiveis.slice(0, qtd);
            
            // Atualiza o "carrinho"
            carrinho.qtd_vagas = qtd;
            carrinho.vagas_ids = vagasSelecionadas;
            carrinho.quarto_nome = select.getAttribute('data-nome');
            carrinho.preco_unidade = preco;
            carrinho.valor_total = preco * qtd;

            // Atualiza o Resumo (na sidebar)
            atualizarResumo();
            
            // (Opcional: Desabilita os outros selects)
            document.querySelectorAll('.quarto-select-vagas').forEach(s => {
                if (s !== select) {
                    s.value = 0; // Reseta os outros
                }
            });
        }
    });

    // --- 5. Lógica: Botão de Ação Principal (Passo 1 ou 2) ---
    document.getElementById('btn-acao-principal').addEventListener('click', () => {
        limparErro();
        
        // Verifica em qual passo estamos
        const passo1 = document.getElementById('passo-1-selecao');
        
        if (!passo1.classList.contains('hidden')) {
            // --- ESTAMOS NO PASSO 1 (Clicou em "Reservar Agora") ---
            // (Chama o "Gargalo de Login")
            checarLoginParaReservar();
        } else {
            // --- ESTAMOS NO PASSO 2 (Clicou em "Confirmar Pagamento") ---
            finalizarPagamento();
        }
    });
    
    // --- 6. Lógica do Modal de Login (O "Gargalo") ---
    const modalLogin = document.getElementById('modal-login-reserva');
    const modalFormLogin = document.getElementById('modal-form-login');
    const modalFormRegister = document.getElementById('modal-form-register');
    
    // Troca para "Cadastro"
    document.getElementById('modal-show-register').addEventListener('click', (e) => {
        e.preventDefault();
        modalFormLogin.classList.add('hidden');
        modalFormRegister.classList.remove('hidden');
    });
    // Troca para "Login"
    document.getElementById('modal-show-login').addEventListener('click', (e) => {
        e.preventDefault();
        modalFormRegister.classList.add('hidden');
        modalFormLogin.classList.remove('hidden');
    });
    // Fecha o modal
    document.getElementById('modal-login-close').addEventListener('click', (e) => {
        modalLogin.classList.remove('active');
    });

    // (Lógica de Fazer Login DENTRO do modal)
    document.getElementById('modal-btn-login').addEventListener('click', () => {
        const email = document.getElementById('modal-login-email').value;
        const senha = document.getElementById('modal-login-senha').value;
        
        fetch('api/usuario/login.php', {
            method: 'POST', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'sucesso') {
                modalLogin.classList.remove('active'); // Fecha o modal
                avancarParaPasso2(); // Avança para o pagamento
            } else {
                document.getElementById('modal-login-error').innerText = "Email ou senha inválidos.";
                document.getElementById('modal-login-error').style.display = 'block';
            }
        });
    });
    
    // (Lógica de Fazer Cadastro DENTRO do modal)
    // (Vamos pular a validação complexa aqui)
    document.getElementById('modal-btn-register').addEventListener('click', () => {
        // (A API de cadastro do modal só precisa do essencial)
        const dados = {
            nome_completo: document.getElementById('modal-reg-nome').value,
            email: document.getElementById('modal-reg-email').value,
            senha: document.getElementById('modal-reg-senha').value,
            // (Enviamos o mínimo, a API completa o resto)
        };

        fetch('api/usuario/cadastro_simplificado.php', { // (Precisamos criar esta API)
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'sucesso') {
                alert("Conta criada! Por favor, faça o login para continuar.");
                document.getElementById('modal-show-login').click(); // Volta pro login
            } else {
                document.getElementById('modal-register-error').innerText = data.mensagem;
                document.getElementById('modal-register-error').style.display = 'block';
            }
        });
    });


}); // Fim do 'DOMContentLoaded'


/**
 * Função: checarLoginParaReservar
 * Descrição: (Ponto de Falha 1) - Agora usa o Modal
 */
function checarLoginParaReservar() {
    fetch('api/usuario/checar_sessao.php', { method: 'GET', credentials: 'include' })
    .then(response => response.json())
    .then(data => {
        if (data.logado && data.tipo_usuario === 'CLIENTE') {
            // --- Usuário está LOGADO ---
            avancarParaPasso2();
        } else {
            // --- Usuário NÃO está logado ---
            // (Limpa os formulários do modal e o abre)
            document.getElementById('modal-form-login').reset();
            document.getElementById('modal-form-register').reset();
            document.getElementById('modal-login-error').style.display = 'none';
            document.getElementById('modal-register-error').style.display = 'none';
            
            document.getElementById('modal-login-reserva').classList.add('active');
        }
    });
}

/**
 * Função: finalizarPagamento
 * Descrição: Lógica do Passo 2 (Chama as APIs de reserva/pagamento)
 */
function finalizarPagamento() {
    // 1. Validar Termos (RF09)
    const termosCheckbox = document.getElementById('termos-aceite');
    if (!termosCheckbox.checked) {
        mostrarErro('erro-termos');
        return;
    }

    // 2. Prepara os dados para a API (Passo 1: Criar)
    const dadosCriacao = {
        vagas_ids: carrinho.vagas_ids,
        checkin: carrinho.checkin,
        checkout: carrinho.checkout,
        valor_total: carrinho.valor_total,
        termo_id: termoIdAtual,
    };

    // 3. Chama a API para CRIAR a reserva (status PENDENTE)
    fetch('api/reserva/criar_reserva.php', {
        method: 'POST',
        credentials: 'include', // Envia o cookie de sessão
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCriacao)
    })
    .then(response => response.json())
    .then(dataCriacao => {
        if (dataCriacao.status === 'erro') {
            mostrarErro(dataCriacao.mensagem);
            return;
        }
        
        // 4. SUCESSO (PENDENTE). Agora, PAGA (CONFIRMA)
        const reservaId = dataCriacao.reserva_id;
        
        fetch('api/reserva/pagar_reserva.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reserva_id: reservaId, dados_cartao: 'simulado' })
        })
        .then(response => response.json())
        .then(dataPagamento => {
            if (dataPagamento.status === 'sucesso') {
                // SUCESSO FINAL!
                alert('Reserva confirmada com sucesso! Você será redirecionado.');
                window.location.href = 'painel_cliente.html';
            } else {
                mostrarErro(dataPagamento.mensagem);
            }
        });
    })
    .catch(error => {
        console.error('Erro no fluxo de reserva:', error);
        mostrarErro('Erro de conexão com a API.');
    });
}