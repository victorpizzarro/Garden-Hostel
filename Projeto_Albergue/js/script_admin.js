/**
 * Arquivo: /js/script_admin.js
 * Descrição: Lógica do Painel de Gestão (painel_admin.html)
 * (Versão 3.0 - Implementando Recepção e Clientes/Reserva Balcão)
 */

// ========================================================================
// DICIONÁRIO DE IDIOMAS (RF10)
// ========================================================================
const dicionarioTextos = {
    'pt': {
        'saudacao': 'Olá', 'btn-sair': '(Sair)', 'admin-menu-titulo': 'Gestão',
        'admin-menu-recepcao': 'Recepção', 'admin-menu-clientes': 'Clientes', 'admin-menu-reservas': 'Reservas',
        'admin-menu-quartos': 'Gestão de Quartos', 'admin-menu-vagas': 'Gestão de Vagas',
        'admin-menu-moderacao': 'Moderação', 'admin-menu-termos': 'Termos de Uso',
        'admin-recepcao-titulo': 'Recepção', 'admin-clientes-titulo': 'Clientes', 'admin-reservas-titulo': 'Todas as Reservas',
        'admin-quartos-titulo': 'Gestão de Quartos',
        'recepcao-checkin-titulo': 'Check-ins Pendentes (Reservas Confirmadas)',
        'recepcao-checkout-titulo': 'Hóspedes Atuais (Check-in Feito)',
        'recepcao-carregando': 'Carregando...',
        'recepcao-nenhum-checkin': 'Nenhum check-in pendente.',
        'recepcao-nenhum-checkout': 'Nenhum hóspede com check-in ativo.',
        'clientes-buscar-titulo': 'Buscar Cliente para Nova Reserva',
        'clientes-btn-buscar': 'Buscar',
        'clientes-nenhum-selecionado': 'Nenhum cliente selecionado.',
        'clientes-digite-busca': 'Digite pelo menos 3 caracteres para buscar.',
        'clientes-nenhum-encontrado': 'Nenhum cliente encontrado.',
        'clientes-btn-selecionar': 'Selecionar',
        'balcao-reserva-titulo': 'Nova Reserva de Balcão para:',
        'balcao-checkin': 'Check-in:', 'balcao-checkout': 'Check-out:',
        'balcao-tipo-quarto': 'Tipo de Quarto:', 'balcao-selecione-tipo': 'Selecione um tipo de quarto',
        'quarto-tipo-feminino': 'Feminino', 'quarto-tipo-masculino': 'Masculino', 'quarto-tipo-misto': 'Misto',
        'balcao-num-hospedes': 'Número de Hóspedes:', 'balcao-btn-verificar': 'Verificar Vagas',
        'balcao-vagas-encontradas': 'Vagas Disponíveis:', 'balcao-btn-confirmar': 'Confirmar Reserva',
        'balcao-buscando-vagas': 'Buscando vagas...',
        'balcao-nenhuma-vaga': 'Nenhuma vaga encontrada para este período/tipo.',
        'balcao-reserva-sucesso': 'Reserva de balcão criada com sucesso!',
        'reservas-buscar-titulo': 'Buscar Reservas', 'reservas-status': 'Status:',
        'reservas-todos-status': 'Todos', 'reservas-cliente': 'Cliente (Nome, Email ou Doc.):',
        'reservas-checkin-min': 'Check-in Mínimo:', 'reservas-checkout-max': 'Check-out Máximo:',
        'reservas-nenhuma-encontrada': 'Nenhuma reserva encontrada.',
        'quartos-lista-titulo': 'Quartos Cadastrados', 'quartos-btn-novo': 'Novo Quarto',
        'quartos-nenhum-cadastrado': 'Nenhum quarto cadastrado.',
        'quartos-modal-titulo-novo': 'Novo Quarto', 'quartos-modal-titulo-editar': 'Editar Quarto',
        'quartos-numero': 'Nome do Quarto:', 'quartos-tipo': 'Tipo:', 'quartos-capacidade': 'Capacidade (Número de camas):',
        'quartos-preco': 'Preço por Diária (R$):', 'quartos-btn-salvar': 'Salvar Quarto',
        'quartos-btn-cancelar': 'Cancelar', 'quartos-desc-pt': 'Descrição (PT-BR)', 'quartos-desc-en': 'Descrição (EN)',
        'alerta-titulo-aviso': 'Aviso', 'alerta-titulo-sucesso': 'Sucesso', 'alerta-titulo-erro': 'Erro',
        'confirm-sim': 'Sim', 'confirm-nao': 'Não', 'alerta-btn-ok': 'OK', 'confirm-padrao': 'Tem certeza?',
        'confirm-excluir-quarto': 'Tem certeza que deseja excluir este quarto?',
        'quarto-salvo-sucesso': 'Quarto salvo com sucesso.',
        'quarto-excluido-sucesso': 'Quarto excluído com sucesso.',
        'recepcao-btn-checkin': 'Fazer Check-in', 'recepcao-btn-pagamento': 'Registrar Pagamento',
        'recepcao-btn-consumo': 'Lançar Consumo', 'recepcao-btn-checkout': 'Fazer Check-out',
        'recepcao-saldo-devedor': 'SALDO DEVEDOR', 'recepcao-consumo-quitado': 'Consumo quitado',
        'recepcao-erro-saldo': 'Erro ao buscar saldo.', 'recepcao-checkin-confirm': 'Confirmar o check-in deste hóspede?',
        'recepcao-checkin-sucesso': 'Check-in realizado!',
        'recepcao-checkout-confirm': 'Confirmar o check-out deste hóspede?',
        'recepcao-checkout-sucesso': 'Check-out realizado!',
        'recepcao-pagamento-titulo': 'Registrar Pagamento (Balcão)',
        'recepcao-pagamento-valor': 'Valor (R$):', 'recepcao-pagamento-metodo': 'Método:',
        'recepcao-pagamento-dinheiro': 'Dinheiro', 'recepcao-pagamento-maquinilha': 'Cartão (Maquininha)',
        'recepcao-pagamento-sucesso': 'Pagamento registrado com sucesso!',
        'recepcao-consumo-titulo': 'Lançar Consumo Extra',
        'recepcao-consumo-descricao': 'Descrição (ex: Toalha, Cerveja):',
        'recepcao-consumo-sucesso': 'Consumo lançado com sucesso!'
    },
    'en': {
        // (Traduções em Inglês)
        'saudacao': 'Hello', 'btn-sair': '(Logout)', 'admin-menu-titulo': 'Management',
        'admin-menu-recepcao': 'Reception', 'admin-menu-clientes': 'Customers', 'admin-menu-reservas': 'Reservations',
        'admin-menu-quartos': 'Room Management', 'admin-menu-vagas': 'Bed Management',
        'admin-menu-moderacao': 'Moderation', 'admin-menu-termos': 'Terms of Use',
        'admin-recepcao-titulo': 'Reception', 'admin-clientes-titulo': 'Customers', 'admin-reservas-titulo': 'All Reservations',
        'admin-quartos-titulo': 'Room Management',
        'recepcao-checkin-titulo': 'Pending Check-ins (Confirmed Reservations)',
        'recepcao-checkout-titulo': 'Current Guests (Checked-in)',
        'recepcao-carregando': 'Loading...',
        'recepcao-nenhum-checkin': 'No pending check-ins.',
        'recepcao-nenhum-checkout': 'No guests currently checked-in.',
        'clientes-buscar-titulo': 'Find Customer for New Reservation',
        'clientes-btn-buscar': 'Search',
        'clientes-nenhum-selecionado': 'No customer selected.',
        'clientes-digite-busca': 'Type at least 3 characters to search.',
        'clientes-nenhum-encontrado': 'No customer found.',
        'clientes-btn-selecionar': 'Select',
        'balcao-reserva-titulo': 'New Counter Reservation for:',
        'balcao-checkin': 'Check-in:', 'balcao-checkout': 'Check-out:',
        'balcao-tipo-quarto': 'Room Type:', 'balcao-selecione-tipo': 'Select a room type',
        'quarto-tipo-feminino': 'Female', 'quarto-tipo-masculino': 'Male', 'quarto-tipo-misto': 'Mixed',
        'balcao-num-hospedes': 'Number of Guests:', 'balcao-btn-verificar': 'Check Beds',
        'balcao-vagas-encontradas': 'Available Beds:', 'balcao-btn-confirmar': 'Confirm Reservation',
        'balcao-buscando-vagas': 'Searching for beds...',
        'balcao-nenhuma-vaga': 'No beds found for this period/type.',
        'balcao-reserva-sucesso': 'Counter reservation created successfully!',
        'reservas-buscar-titulo': 'Search Reservations', 'reservas-status': 'Status:',
        'reservas-todos-status': 'All', 'reservas-cliente': 'Customer (Name, Email or Doc.):',
        'reservas-checkin-min': 'Min. Check-in:', 'reservas-checkout-max': 'Max. Check-out:',
        'reservas-nenhuma-encontrada': 'No reservations found.',
        'quartos-lista-titulo': 'Registered Rooms', 'quartos-btn-novo': 'New Room',
        'quartos-nenhum-cadastrado': 'No rooms registered.',
        'quartos-modal-titulo-novo': 'New Room', 'quartos-modal-titulo-editar': 'Edit Room',
        'quartos-numero': 'Room Name/Number:', 'quartos-tipo': 'Type:', 'quartos-capacidade': 'Capacity (Beds):',
        'quartos-preco': 'Price per Night (R$):', 'quartos-btn-salvar': 'Save Room',
        'quartos-btn-cancelar': 'Cancel', 'quartos-desc-pt': 'Description (PT-BR)', 'quartos-desc-en': 'Description (EN)',
        'alerta-titulo-aviso': 'Notice', 'alerta-titulo-sucesso': 'Success', 'alerta-titulo-erro': 'Error',
        'confirm-sim': 'Yes', 'confirm-nao': 'No', 'alerta-btn-ok': 'OK', 'confirm-padrao': 'Are you sure?',
        'confirm-excluir-quarto': 'Are you sure you want to delete this room?',
        'quarto-salvo-sucesso': 'Room saved successfully.',
        'quarto-excluido-sucesso': 'Room deleted successfully.',
        'recepcao-btn-checkin': 'Check-in', 'recepcao-btn-pagamento': 'Register Payment',
        'recepcao-btn-consumo': 'Add Consumption', 'recepcao-btn-checkout': 'Check-out',
        'recepcao-saldo-devedor': 'BALANCE DUE', 'recepcao-consumo-quitado': 'Consumption paid',
        'recepcao-erro-saldo': 'Error fetching balance.', 'recepcao-checkin-confirm': 'Confirm check-in for this guest?',
        'recepcao-checkin-sucesso': 'Check-in successful!',
        'recepcao-checkout-confirm': 'Confirm check-out for this guest?',
        'recepcao-checkout-sucesso': 'Check-out successful!',
        'recepcao-pagamento-titulo': 'Register Payment (Counter)',
        'recepcao-pagamento-valor': 'Amount (R$):', 'recepcao-pagamento-metodo': 'Method:',
        'recepcao-pagamento-dinheiro': 'Cash', 'recepcao-pagamento-maquinilha': 'Card (POS)',
        'recepcao-pagamento-sucesso': 'Payment registered successfully!',
        'recepcao-consumo-titulo': 'Add Extra Consumption',
        'recepcao-consumo-descricao': 'Description (e.g., Towel, Beer):',
        'recepcao-consumo-sucesso': 'Consumption added successfully!'
    }
};

// ========================================================================
// SCRIPT PRINCIPAL
// ========================================================================

let idiomaAtual = localStorage.getItem('idioma') || 'pt';
let usuarioLogado = null; // Guarda o 'tipo' e 'nome' do admin
let abaAtiva = 'recepcao'; // Guarda a aba atual

// ========================================================================
// FUNÇÕES GLOBAIS DE AJUDA
// ========================================================================

function aplicarTraducoes() {
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (dicionarioTextos[idiomaAtual][key]) {
            elem.innerText = dicionarioTextos[idiomaAtual][key];
        }
    });
    document.body.classList.add('js-traduzido');
    if (usuarioLogado) {
        const saudacao = dicionarioTextos[idiomaAtual]['saudacao'];
        document.getElementById('user-welcome').innerText = `${saudacao}, ${usuarioLogado.nome}`;
    }
}

// (Funções de Alerta e Confirmação)
const modalAlerta = document.getElementById('modal-alerta');
const alertaTitulo = document.getElementById('alerta-titulo');
const alertaTexto = document.getElementById('alerta-texto');
const alertaOkBtn = document.getElementById('alerta-ok-btn');

function mostrarAlerta(mensagemKey, tipo = 'aviso') {
    let mensagemTraduzida = dicionarioTextos[idiomaAtual][mensagemKey] || mensagemKey;
    if (tipo === 'sucesso') {
        alertaTitulo.innerText = dicionarioTextos[idiomaAtual]['alerta-titulo-sucesso'];
    } else if (tipo === 'erro') {
        alertaTitulo.innerText = dicionarioTextos[idiomaAtual]['alerta-titulo-erro'];
    } else {
        alertaTitulo.innerText = dicionarioTextos[idiomaAtual]['alerta-titulo-aviso'];
    }
    alertaTexto.innerText = mensagemTraduzida;
    modalAlerta.classList.add('active');
}
alertaOkBtn.addEventListener('click', () => {
    modalAlerta.classList.remove('active');
});

const modalConfirmacao = document.getElementById('modal-confirmacao');
const confirmTitulo = document.getElementById('confirm-titulo');
const confirmTexto = document.getElementById('confirm-texto');
const confirmBtnSim = document.getElementById('confirm-btn-sim');
const confirmBtnNao = document.getElementById('confirm-btn-nao');

function mostrarConfirmacao(mensagemKey, callback) {
    confirmTitulo.innerText = dicionarioTextos[idiomaAtual]['alerta-titulo-aviso'];
    confirmTexto.innerText = dicionarioTextos[idiomaAtual][mensagemKey];
    confirmBtnSim.innerText = dicionarioTextos[idiomaAtual]['confirm-sim'];
    confirmBtnNao.innerText = dicionarioTextos[idiomaAtual]['confirm-nao'];
    modalConfirmacao.classList.add('active');
    
    confirmBtnNao.onclick = () => {
        modalConfirmacao.classList.remove('active');
    };
    confirmBtnSim.onclick = () => {
        modalConfirmacao.classList.remove('active');
        callback(); 
    };
}


// ========================================================================
// INÍCIO DO DOMContentLoaded
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. O "PORTÃO DE SEGURANÇA" ---
    fetch('api/usuario/checar_sessao.php', { method: 'GET', credentials: 'include' })
    .then(response => response.json())
    .then(data => {
        if (!data.logado || (data.tipo_usuario !== 'ATENDENTE' && data.tipo_usuario !== 'ADMIN_MASTER')) {
            window.location.href = 'login.html';
        } else {
            usuarioLogado = data; 
            iniciarPaginaAdmin(); 
        }
    })
    .catch(error => {
        console.error('Erro na checagem de sessão:', error);
        window.location.href = 'login.html';
    });
});

// ========================================================================
// FUNÇÃO PRINCIPAL (INICIA A PÁGINA)
// ========================================================================

function iniciarPaginaAdmin() {
    
    // --- Lógica de Permissão (Esconde links do Atendente) ---
    if (usuarioLogado.tipo_usuario === 'ATENDENTE') {
        document.getElementById('nav-gestao-quartos').classList.add('hidden');
        document.getElementById('nav-gestao-vagas').classList.add('hidden');
        document.getElementById('nav-moderacao').classList.add('hidden');
        document.getElementById('nav-termos').classList.add('hidden');
    }

    // --- Lógica de Idioma (RF10) ---
    aplicarTraducoes(); 
    const btnPt = document.getElementById('btn-lang-pt');
    const btnEn = document.getElementById('btn-lang-en');

    function atualizarBotoesIdioma() {
        if (idiomaAtual === 'en') {
            btnEn.classList.add('active');
            btnPt.classList.remove('active');
        } else {
            btnPt.classList.add('active');
            btnEn.classList.remove('active');
        }
    }
    atualizarBotoesIdioma(); 

    btnPt.addEventListener('click', () => {
        idiomaAtual = 'pt'; localStorage.setItem('idioma', 'pt');
        atualizarBotoesIdioma(); aplicarTraducoes();
        carregarDadosAbaAtiva();
    });
    btnEn.addEventListener('click', () => {
        idiomaAtual = 'en'; localStorage.setItem('idioma', 'en');
        atualizarBotoesIdioma(); aplicarTraducoes();
        carregarDadosAbaAtiva();
    });

    // --- Lógica de Logout ---
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        fetch('api/usuario/logout.php', { method: 'GET', credentials: 'include' })
            .then(() => { window.location.href = 'index.html'; });
    });

    // --- Lógica de Navegação das Abas (Sidebar) ---
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const contentSections = document.querySelectorAll('.painel-main-content section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); 
            
            contentSections.forEach(section => section.classList.add('hidden'));
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            const targetSection = document.getElementById(`conteudo-${targetId}`);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
            link.classList.add('active');
            
            abaAtiva = targetId; 
            carregarDadosAbaAtiva(); 
        });
    });

    // --- Lógica de Carregamento de Dados (Abas) ---
    function carregarDadosAbaAtiva() {
        console.log(`Carregando aba: ${abaAtiva}`);
        switch (abaAtiva) {
            case 'recepcao':
                carregarAbaRecepcao();
                break;
            case 'clientes':
                // (Não precisa carregar nada ao entrar na aba, 
                // a lógica é ativada pelo clique no botão "Buscar")
                break;
            case 'reservas':
                carregarAbaReservas();
                break;
            case 'gestao-quartos':
                carregarAbaGestaoQuartos();
                break;
        }
    }

    // --- Carrega a aba padrão ---
    carregarDadosAbaAtiva();

    // --- Liga os Eventos das Abas (que são fixos) ---
    ligarEventosGestaoQuartos();
    ligarEventosClientes();
    ligarEventosRecepcao();

} // Fim do iniciarPaginaAdmin()


// ========================================================================
// ABA 1: RECEPÇÃO (RF01, RF12, RF13)
// ========================================================================
function carregarAbaRecepcao() {
    const checkinsContainer = document.getElementById('checkins-lista');
    const checkoutsContainer = document.getElementById('checkouts-lista');
    
    checkinsContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-carregando']}</p>`;
    checkoutsContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-carregando']}</p>`;

    // 1. Busca TODAS as reservas ativas (Confirmadas E Check-in)
    fetch('api/admin/buscar_reservas_recepcao.php', { method: 'GET', credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            checkinsContainer.innerHTML = '';
            checkoutsContainer.innerHTML = '';

            if (data.status === 'erro') {
                checkinsContainer.innerHTML = `<p>${data.mensagem}</p>`;
                return;
            }

            const checkins = data.filter(r => r.status_reserva === 'CONFIRMADA');
            const checkouts = data.filter(r => r.status_reserva === 'CHECKIN');

            // 2. Popula Lista de Check-ins (Status = CONFIRMADA)
            if (checkins.length > 0) {
                checkins.forEach(reserva => {
                    const card = criarCardRecepcao(reserva);
                    checkinsContainer.appendChild(card);
                });
            } else {
                checkinsContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-nenhum-checkin']}</p>`;
            }
            
            // 3. Popula Lista de Hóspedes Atuais (Status = CHECKIN)
            if (checkouts.length > 0) {
                checkouts.forEach(reserva => {
                    const card = criarCardRecepcao(reserva);
                    checkoutsContainer.appendChild(card);
                    
                    // 4. (IMPORTANTE) Atualiza o saldo e o botão de checkout
                    // para cada card de hóspede atual.
                    atualizarSaldoDevedor(reserva.id);
                });
            } else {
                checkoutsContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-nenhum-checkout']}</p>`;
            }
        })
        .catch(err => {
            console.error('Erro ao carregar recepção:', err);
            checkinsContainer.innerHTML = `<p>Erro ao carregar dados da recepção.</p>`;
        });
}

/**
 * (Recepção) Helper: Cria os cards de check-in/out
 */
function criarCardRecepcao(reserva) {
    const card = document.createElement('div');
    card.className = 'reserva-check-card';
    
    // Traduz os textos
    const btnCheckinTexto = dicionarioTextos[idiomaAtual]['recepcao-btn-checkin'];
    const btnPagamentoTexto = dicionarioTextos[idiomaAtual]['recepcao-btn-pagamento'];
    const btnConsumoTexto = dicionarioTextos[idiomaAtual]['recepcao-btn-consumo'];
    const btnCheckoutTexto = dicionarioTextos[idiomaAtual]['recepcao-btn-checkout'];
    const statusTexto = dicionarioTextos[idiomaAtual][`status-${reserva.status_reserva}`] || reserva.status_reserva;

    let actionsHTML = '';
    
    if (reserva.status_reserva === 'CONFIRMADA') {
        // Ações para quem vai fazer Check-in
        actionsHTML = `
            <button class="btn btn-primary btn-fazer-checkin" data-id="${reserva.id}">${btnCheckinTexto}</button>
            ${reserva.origem === 'BALCAO' ? `<button class="btn btn-secondary btn-registrar-pagamento" data-id="${reserva.id}" data-valor="${reserva.valor_total_diarias}" data-tipo="DIARIA">${btnPagamentoTexto}</button>` : ''}
        `;
    } else if (reserva.status_reserva === 'CHECKIN') {
        // Ações para quem vai fazer Check-out
        actionsHTML = `
            <button class="btn btn-success btn-lancar-consumo" data-id="${reserva.id}">${btnConsumoTexto}</button>
            <button class="btn btn-primary btn-fazer-checkout" id="btn-checkout-${reserva.id}" data-id="${reserva.id}" disabled>${btnCheckoutTexto}</button>
        `;
    }
    
    // Monta o HTML do Card
    card.innerHTML = `
        <div class="header">
            <strong>${reserva.cliente_nome} (Reserva #${reserva.id})</strong>
            <span class="status status-${reserva.status_reserva.toLowerCase()}">${statusTexto}</span>
        </div>
        <div class="body">
            <p><strong>Check-in:</strong> ${reserva.data_checkin}</p>
            <p><strong>Check-out:</strong> ${reserva.data_checkout}</p>
            <p><strong>Vagas:</strong> ${reserva.vagas_count}</p>
            <p><strong>Valor Diárias:</strong> R$ ${reserva.valor_total_diarias}</p>
        </div>
        
        ${reserva.status_reserva === 'CHECKIN' ? `
            <div class="consumo-section">
                <h4>Consumo Extra (RF12/RF13)</h4>
                <div id="consumo-lista-${reserva.id}" class="painel-lista">
                    </div>
                
                <form class="consumo-form" data-id="${reserva.id}">
                    <input type="text" class="consumo-descricao" placeholder="${dicionarioTextos[idiomaAtual]['recepcao-consumo-descricao']}" required>
                    <input type="number" class="consumo-valor" placeholder="R$" step="0.01" min="0.01" required>
                    <button type="submit" class="btn btn-secondary">${btnConsumoTexto}</button>
                </form>

                <div id="saldo-info-${reserva.id}" class="saldo-info">...</div>
            </div>
        ` : ''}
        
        <div class="footer-actions">
            ${actionsHTML}
        </div>
    `;
    return card;
}

/**
 * (Recepção) Lógica do Saldo Devedor (Ponto de Falha 3)
 */
function atualizarSaldoDevedor(reservaId) {
    const saldoInfo = document.getElementById(`saldo-info-${reservaId}`);
    const btnCheckout = document.getElementById(`btn-checkout-${reservaId}`);
    
    if (!saldoInfo) return; 
    
    saldoInfo.innerText = dicionarioTextos[idiomaAtual]['recepcao-carregando'];
    
    fetch(`api/admin/buscar_saldo_devedor.php?reserva_id=${reservaId}`, { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                if (data.saldo_devedor > 0) {
                    saldoInfo.innerHTML = `${dicionarioTextos[idiomaAtual]['recepcao-saldo-devedor']}: R$ ${data.saldo_devedor.toFixed(2)}`;
                    saldoInfo.className = 'saldo-info devedor';
                    if (btnCheckout) btnCheckout.disabled = true; // Desabilita
                } else {
                    saldoInfo.innerHTML = `${dicionarioTextos[idiomaAtual]['recepcao-consumo-quitado']} (R$ ${data.total_consumido.toFixed(2)})`;
                    saldoInfo.className = 'saldo-info quitado';
                    if (btnCheckout) btnCheckout.disabled = false; // Habilita
                }
            } else {
                saldoInfo.innerHTML = dicionarioTextos[idiomaAtual]['recepcao-erro-saldo'];
            }
        });
}

/**
 * (Recepção) Liga os Event Listeners (Submit e Click)
 */
function ligarEventosRecepcao() {
    const mainContent = document.querySelector('.painel-main-content');

    // --- AÇÃO: Lançar Consumo (Submit do form) ---
    mainContent.addEventListener('submit', (e) => {
        if (e.target.classList.contains('consumo-form')) {
            e.preventDefault(); 
            
            const reservaId = e.target.getAttribute('data-id');
            const descricaoInput = e.target.querySelector('.consumo-descricao');
            const valorInput = e.target.querySelector('.consumo-valor');

            const descricao = descricaoInput.value;
            const valor = valorInput.value;

            if (!descricao || !valor) {
                mostrarAlerta('Descrição e valor são obrigatórios.', 'erro');
                return;
            }

            fetch('api/admin/adicionar_consumo.php', {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reserva_id: reservaId, descricao: descricao, valor: valor })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'sucesso') {
                    mostrarAlerta(dicionarioTextos[idiomaAtual]['recepcao-consumo-sucesso'], 'sucesso');
                    e.target.reset(); // Limpa o formulário
                    atualizarSaldoDevedor(reservaId); // Atualiza o saldo
                } else {
                    mostrarAlerta(data.mensagem, 'erro');
                }
            });
        }
    });

    // --- AÇÃO: Check-in, Check-out, Registrar Pagamento (Click) ---
    mainContent.addEventListener('click', (e) => {
        
        // --- FAZER CHECK-IN ---
        if (e.target.classList.contains('btn-fazer-checkin')) {
            const reservaId = e.target.getAttribute('data-id');
            mostrarConfirmacao(dicionarioTextos[idiomaAtual]['recepcao-checkin-confirm'], () => {
                fetch('api/admin/fazer_checkin.php', {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reserva_id: reservaId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        mostrarAlerta(dicionarioTextos[idiomaAtual]['recepcao-checkin-sucesso'], 'sucesso');
                        carregarAbaRecepcao(); // Recarrega a aba
                    } else {
                        mostrarAlerta(data.mensagem, 'erro');
                    }
                });
            });
        }

        // --- FAZER CHECK-OUT ---
        if (e.target.classList.contains('btn-fazer-checkout')) {
            const reservaId = e.target.getAttribute('data-id');
            mostrarConfirmacao(dicionarioTextos[idiomaAtual]['recepcao-checkout-confirm'], () => {
                fetch('api/admin/fazer_checkout.php', {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reserva_id: reservaId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        mostrarAlerta(dicionarioTextos[idiomaAtual]['recepcao-checkout-sucesso'], 'sucesso');
                        carregarAbaRecepcao(); // Recarrega a aba
                    } else {
                        mostrarAlerta(data.mensagem, 'erro');
                    }
                });
            });
        }

        // --- REGISTRAR PAGAMENTO (Balcão) ---
        if (e.target.classList.contains('btn-registrar-pagamento')) {
            const reservaId = e.target.getAttribute('data-id');
            const valor = e.target.getAttribute('data-valor');
            const tipo = e.target.getAttribute('data-tipo'); // 'DIARIA' ou 'EXTRA'
            
            // (Para a apresentação, vamos usar um 'prompt' simples
            // em vez de um modal complexo de pagamento)
            const metodo = prompt(dicionarioTextos[idiomaAtual]['recepcao-pagamento-metodo'], 'DINHEIRO'); 
            
            if (metodo === 'DINHEIRO' || metodo === 'CARTAO_MAQUININHA') {
                fetch('api/admin/registrar_pagamento.php', {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reserva_id: reservaId, valor: valor, tipo: tipo, metodo: metodo })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        mostrarAlerta(dicionarioTextos[idiomaAtual]['recepcao-pagamento-sucesso'], 'sucesso');
                        carregarAbaRecepcao(); // Recarrega a aba
                    } else {
                        mostrarAlerta(data.mensagem, 'erro');
                    }
                });
            }
        }
    });
}


/**
 * ABA 2: CLIENTES (RF08, RF01)
 */
let clienteSelecionadoId = null; // Guarda o ID do cliente

function carregarAbaClientes() {
    // Esta função agora está vazia, pois a lógica
    // só precisa ser ligada uma vez (em ligarEventosClientes)
}

function ligarEventosClientes() {
    const btnBuscar = document.getElementById('btn-buscar-cliente');
    const termoBusca = document.getElementById('cliente-busca-termo');
    const listaContainer = document.getElementById('clientes-lista-busca');
    const formNovaReserva = document.getElementById('form-nova-reserva-balcao');
    
    // Lógica do botão "Buscar"
    btnBuscar.addEventListener('click', () => {
        const termo = termoBusca.value;
        if (termo.length < 3) {
            mostrarAlerta(dicionarioTextos[idiomaAtual]['clientes-digite-busca'], 'erro');
            return;
        }
        
        listaContainer.innerHTML = "<p>Buscando...</p>";
        
        fetch(`api/admin/buscar_clientes.php?tipo=termo&valor=${termo}`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                listaContainer.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(cliente => {
                        const card = document.createElement('div');
                        card.className = 'cliente-card';
                        card.innerHTML = `
                            <div class="info">
                                <strong>${cliente.nome_completo}</strong>
                                <p>Email: ${cliente.email} | Doc: ${cliente.documento_numero}</p>
                            </div>
                            <button class="btn btn-success btn-selecionar-cliente" data-id="${cliente.id}" data-nome="${cliente.nome_completo}">${dicionarioTextos[idiomaAtual]['clientes-btn-selecionar']}</button>
                        `;
                        listaContainer.appendChild(card);
                    });
                } else {
                    listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['clientes-nenhum-encontrado']}</p>`;
                }
            });
    });
    
    // Lógica do botão "Selecionar" (usando delegação)
    listaContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-selecionar-cliente')) {
            clienteSelecionadoId = e.target.getAttribute('data-id');
            const nomeCliente = e.target.getAttribute('data-nome');
            
            document.getElementById('cliente-selecionado-nome').innerText = nomeCliente;
            formNovaReserva.classList.remove('hidden');
        }
    });
    
    // (Ainda falta implementar a lógica de "Verificar Vagas"
    // e "Confirmar Reserva" para o balcão)
}


/**
 * ABA 3: RESERVAS
 */
function carregarAbaReservas() {
    // (Esta API 'buscar_todas_reservas.php' ainda não foi criada)
    document.getElementById('todas-reservas-lista').innerHTML = `<p>${dicionarioTextos[idiomaAtual]['reservas-nenhuma-encontrada']}</p>`;
}


/**
 * ABA 4: GESTÃO DE QUARTOS (RF03)
 */
const modalQuarto = document.getElementById('modal-quarto-form');
const formQuarto = document.getElementById('form-quarto');
const quartoFormTitulo = document.getElementById('quarto-form-titulo');
const quartoFormMessage = document.getElementById('quarto-form-message');
let quartoIdEmEdicao = null; 

function carregarAbaGestaoQuartos() {
    const listaContainer = document.getElementById('quartos-lista');
    listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-carregando']}</p>`;
    
    fetch('api/admin/quarto_crud.php?acao=listar', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            listaContainer.innerHTML = '';
            if (data.length > 0) {
                data.forEach(quarto => {
                    const card = document.createElement('div');
                    card.className = 'list-item-card'; 
                    card.innerHTML = `
                        <div class="info">
                            <strong>${quarto.nome} (${quarto.tipo})</strong>
                            <p>Capacidade: ${quarto.capacidade} camas | Preço: R$ ${quarto.preco_diaria}</p>
                        </div>
                        <div class="actions">
                            <button class="btn btn-secondary btn-editar-quarto" data-id="${quarto.id}">Editar</button>
                            <button class="btn btn-cancelar btn-excluir-quarto" data-id="${quarto.id}">Excluir</button>
                        </div>
                    `;
                    listaContainer.appendChild(card);
                });
            } else {
                listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['quartos-nenhum-cadastrado']}</p>`;
            }
        });
}

// Liga os eventos dos botões e modais (só precisa rodar uma vez)
function ligarEventosGestaoQuartos() {
    
    // --- Eventos do Modal (Abrir/Fechar) ---
    document.getElementById('btn-novo-quarto').addEventListener('click', () => {
        quartoIdEmEdicao = null; 
        quartoFormTitulo.innerText = dicionarioTextos[idiomaAtual]['quartos-modal-titulo-novo'];
        formQuarto.reset(); 
        quartoFormMessage.classList.add('hidden');
        modalQuarto.classList.add('active');
    });
    
    document.getElementById('btn-fechar-quarto-modal').addEventListener('click', () => {
        modalQuarto.classList.remove('active');
    });

    // --- Evento de Salvar (Criar ou Editar) ---
    formQuarto.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const dadosQuarto = {
            nome: document.getElementById('quarto-numero').value,
            tipo: document.getElementById('quarto-tipo').value,
            capacidade: document.getElementById('quarto-capacidade').value,
            preco_diaria: document.getElementById('quarto-preco-diaria').value,
            // (Faltam campos no HTML para descrição PT/EN)
            descricao_pt: `(Descrição PT pendente)`, 
            descricao_en: `(Description EN pending)`
        };
        
        let url = 'api/admin/quarto_crud.php';
        let body;

        if (quartoIdEmEdicao) {
            body = { acao: 'alterar', id: quartoIdEmEdicao, dados: dadosQuarto };
        } else {
            body = { acao: 'criar', dados: dadosQuarto };
        }
        
        fetch(url, {
            method: 'POST', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                mostrarAlerta(dicionarioTextos[idiomaAtual]['quarto-salvo-sucesso'], 'sucesso');
                modalQuarto.classList.remove('active');
                carregarAbaGestaoQuartos(); 
            } else {
                quartoFormMessage.innerText = data.mensagem;
                quartoFormMessage.classList.remove('hidden');
            }
        })
        .catch(err => {
            quartoFormMessage.innerText = 'Erro de conexão com a API.';
            quartoFormMessage.classList.remove('hidden');
        });
    });

    // --- Eventos de Editar/Excluir (Delegação de Evento) ---
    document.getElementById('quartos-lista').addEventListener('click', (e) => {
        
        // --- Ação: EXCLUIR ---
        if (e.target.classList.contains('btn-excluir-quarto')) {
            const quartoId = e.target.getAttribute('data-id');
            
            mostrarConfirmacao(dicionarioTextos[idiomaAtual]['confirm-excluir-quarto'], () => {
                fetch('api/admin/quarto_crud.php', {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ acao: 'excluir', id: quartoId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        mostrarAlerta(dicionarioTextos[idiomaAtual]['quarto-excluido-sucesso'], 'sucesso');
                        carregarAbaGestaoQuartos(); 
                    } else {
                        mostrarAlerta(data.mensagem, 'erro'); // (Ex: "Exclua as vagas primeiro")
                    }
                });
            });
        }
        
        // --- Ação: EDITAR ---
        if (e.target.classList.contains('btn-editar-quarto')) {
            const quartoId = e.target.getAttribute('data-id');
            quartoIdEmEdicao = quartoId; 
            
            // (Simulação: Preenche o formulário.)
            const info = e.target.closest('.list-item-card').querySelector('.info');
            const nome = info.querySelector('strong').innerText.split(' (')[0];
            const tipo = info.querySelector('strong').innerText.match(/\((.*?)\)/)[1];
            const capacidade = info.querySelector('p').innerText.match(/Capacidade: (\d+)/)[1];
            const preco = info.querySelector('p').innerText.match(/Preço: R\$ ([\d\.]+)/)[1];

            document.getElementById('quarto-numero').value = nome;
            document.getElementById('quarto-tipo').value = tipo;
            document.getElementById('quarto-capacidade').value = capacidade;
            document.getElementById('quarto-preco-diaria').value = preco;
            
            quartoFormTitulo.innerText = `${dicionarioTextos[idiomaAtual]['quartos-modal-titulo-editar']} #${quartoId}`;
            quartoFormMessage.classList.add('hidden');
            modalQuarto.classList.add('active');
        }
    });
}