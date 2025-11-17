/**
 * Arquivo: /js/script_admin.js
 * Descrição: Lógica do Painel de Gestão (painel_admin.html)
 * (Versão 4.0 - Implementando Gestão de Vagas e Datas de Quarto)
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
        'quartos-preco': 'Preço por Diária (R$):', 'quartos-data-entrada': 'Data de Entrada:', 'quartos-data-saida': 'Data de Saída:', 'quartos-saida-indefinida': 'Indefinido', 'quartos-btn-salvar': 'Salvar Quarto',
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
        'quartos-preco': 'Price per Night (R$):', 'quartos-data-entrada': 'Entry Date:', 'quartos-data-saida': 'Exit Date:', 'quartos-saida-indefinida': 'Indefinite', 'quartos-btn-salvar': 'Save Room',
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
    confirmTexto.innerText = dicionarioTextos[idiomaAtual][mensagemKey] || mensagemKey; // CORREÇÃO: Adicionado fallback
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
// FUNÇÃO AUXILIAR PARA FORMATAR DATAS
// ========================================================================

function formatarData(dataString) {
    if (!dataString) return 'N/D';
    
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dataString;
    }
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
            console.log('Usuário logado:', usuarioLogado);
            console.log('Iniciando página admin...');
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
        console.log(`=== CARREGANDO ABA: ${abaAtiva} ===`);
        
        switch (abaAtiva) {
            case 'recepcao':
                console.log('Chamando carregarAbaRecepcao()');
                carregarAbaRecepcao();
                break;
            case 'clientes':
                console.log('Chamando carregarAbaClientes()');
                carregarAbaClientes();
                break;
            case 'reservas':
                console.log('Chamando carregarAbaReservas()');
                carregarAbaReservas();
                break;
            case 'gestao-quartos':
                console.log('Chamando carregarAbaGestaoQuartos()');
                carregarAbaGestaoQuartos();
                break;
            case 'gestao-vagas':
                console.log('Chamando carregarAbaGestaoVagas()');
                carregarAbaGestaoVagas();
                break;
        }
    }

    // --- Carrega a aba padrão ---
    carregarDadosAbaAtiva();

    // --- Liga os Eventos das Abas (que são fixos) ---
    ligarEventosGestaoQuartos();
    ligarEventosClientes();
    ligarEventosRecepcao();
    ligarEventosReservas();
    ligarEventosGestaoVagas();

} // Fim do iniciarPaginaAdmin()

// ========================================================================
// ABA 1: RECEPÇÃO (RF01, RF12, RF13) - CORRIGIDA
// ========================================================================

function carregarAbaRecepcao() {
    console.log('Carregando recepção...');
    
    // Carrega check-ins pendentes (reservas CONFIRMADAS)
    fetch('api/admin/recepcao.php?acao=checkins_pendentes', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('checkins-lista');
            container.innerHTML = '';
            
            if (data.length > 0) {
                data.forEach(reserva => {
                    container.appendChild(criarCardRecepcao(reserva, 'checkin'));
                });
            } else {
                container.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-nenhum-checkin']}</p>`;
            }
        })
        .catch(error => {
            console.error('Erro ao carregar check-ins:', error);
            document.getElementById('checkins-lista').innerHTML = '<p>Erro ao carregar check-ins</p>';
        });

    // Carrega hóspedes atuais (CHECK-IN feito)
    fetch('api/admin/recepcao.php?acao=hospedes_ativos', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('checkouts-lista');
            container.innerHTML = '';
            
            if (data.length > 0) {
                data.forEach(reserva => {
                    container.appendChild(criarCardRecepcao(reserva, 'checkout'));
                });
            } else {
                container.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-nenhum-checkout']}</p>`;
            }
        })
        .catch(error => {
            console.error('Erro ao carregar check-outs:', error);
            document.getElementById('checkouts-lista').innerHTML = '<p>Erro ao carregar check-outs</p>';
        });
}

// ========================================================================
// ABA 1: RECEPÇÃO - FUNÇÕES CORRIGIDAS COM BOTÕES
// ========================================================================

function criarCardRecepcao(reserva, tipo) {
    const card = document.createElement('div');
    card.className = 'list-item-card';
    card.dataset.reservaId = reserva.id;
    
    const statusBadge = reserva.status ? `<span class="status-badge status-${reserva.status.toLowerCase()}">${reserva.status}</span>` : '';
    
    if (tipo === 'checkin') {
        // CARDS DE CHECK-IN PENDENTE (Reservas CONFIRMADAS)
        card.innerHTML = `
            <div class="info">
                <strong>${reserva.nome_cliente || 'Cliente não encontrado'}</strong>
                ${statusBadge}
                <p>Check-in: ${formatarData(reserva.data_checkin)} | Check-out: ${formatarData(reserva.data_checkout)}</p>
                <p>Quarto: ${reserva.nome_quarto || 'N/D'} | Vagas: ${reserva.vagas_count || '1'}</p>
                <p>${reserva.email_cliente || ''} | ${reserva.documento_cliente || ''}</p>
            </div>
            <div class="actions">
                <button class="btn btn-primary btn-checkin" data-id="${reserva.id}">
                    ${dicionarioTextos[idiomaAtual]['recepcao-btn-checkin']}
                </button>
                <button class="btn btn-cancelar btn-cancelar-reserva" data-id="${reserva.id}">
                    Cancelar
                </button>
            </div>
        `;
    } else {
        // CARDS DE HÓSPEDES ATIVOS (CHECK-IN FEITO)
        card.innerHTML = `
            <div class="info">
                <strong>${reserva.nome_cliente || 'Cliente não encontrado'}</strong>
                ${statusBadge}
                <p>Check-in: ${formatarData(reserva.data_checkin)} | Check-out: ${formatarData(reserva.data_checkout)}</p>
                <p>Quarto: ${reserva.nome_quarto || 'N/D'} | Vaga: ${reserva.nome_vaga || 'N/D'}</p>
                <div class="saldo-info" id="saldo-${reserva.id}">
                    <em>Carregando saldo...</em>
                </div>
            </div>
            <div class="actions">
                <button class="btn btn-secondary btn-pagamento" data-id="${reserva.id}">
                    ${dicionarioTextos[idiomaAtual]['recepcao-btn-pagamento']}
                </button>
                <button class="btn btn-secondary btn-consumo" data-id="${reserva.id}">
                    ${dicionarioTextos[idiomaAtual]['recepcao-btn-consumo']}
                </button>
                <button class="btn btn-primary btn-checkout" data-id="${reserva.id}">
                    ${dicionarioTextos[idiomaAtual]['recepcao-btn-checkout']}
                </button>
            </div>
        `;
        
        // Carrega o saldo devedor
        atualizarSaldoDevedor(reserva.id);
    }
    
    return card;
}

function atualizarSaldoDevedor(reservaId) {
    fetch(`api/admin/recepcao.php?acao=saldo_devedor&reserva_id=${reservaId}`, { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const saldoElem = document.getElementById(`saldo-${reservaId}`);
            if (saldoElem) {
                if (data.saldo !== undefined) {
                    if (data.saldo > 0) {
                        saldoElem.innerHTML = `<strong class="saldo-negativo">${dicionarioTextos[idiomaAtual]['recepcao-saldo-devedor']}: R$ ${data.saldo.toFixed(2)}</strong>`;
                    } else {
                        saldoElem.innerHTML = `<span class="saldo-positivo">${dicionarioTextos[idiomaAtual]['recepcao-consumo-quitado']}</span>`;
                    }
                } else {
                    saldoElem.innerHTML = `<em>${dicionarioTextos[idiomaAtual]['recepcao-erro-saldo']}</em>`;
                }
            }
        })
        .catch(error => {
            console.error('Erro ao carregar saldo:', error);
            const saldoElem = document.getElementById(`saldo-${reservaId}`);
            if (saldoElem) {
                saldoElem.innerHTML = `<em>${dicionarioTextos[idiomaAtual]['recepcao-erro-saldo']}</em>`;
            }
        });
}

function ligarEventosRecepcao() {
    // Eventos de delegação para os botões dinâmicos
    document.getElementById('checkins-lista').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-checkin')) {
            const reservaId = e.target.getAttribute('data-id');
            fazerCheckin(reservaId);
        }
        if (e.target.classList.contains('btn-cancelar-reserva')) {
            const reservaId = e.target.getAttribute('data-id');
            cancelarReserva(reservaId);
        }
    });
    
    document.getElementById('checkouts-lista').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-checkout')) {
            const reservaId = e.target.getAttribute('data-id');
            fazerCheckout(reservaId);
        }
        if (e.target.classList.contains('btn-pagamento')) {
            const reservaId = e.target.getAttribute('data-id');
            abrirModalPagamento(reservaId);
        }
        if (e.target.classList.contains('btn-consumo')) {
            const reservaId = e.target.getAttribute('data-id');
            abrirModalConsumo(reservaId);
        }
    });
}


function fazerCheckin(reservaId) {
    mostrarConfirmacao('recepcao-checkin-confirm', () => {
        // CORREÇÃO: Enviar como FormData ou URL encoded em vez de JSON
        const formData = new FormData();
        formData.append('acao', 'fazer_checkin');
        formData.append('reserva_id', reservaId);
        
        fetch('api/admin/recepcao.php', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                mostrarAlerta('recepcao-checkin-sucesso', 'sucesso');
                carregarAbaRecepcao(); // Recarrega a lista
            } else {
                mostrarAlerta(data.mensagem, 'erro');
            }
        })
        .catch(error => {
            console.error('Erro no check-in:', error);
            mostrarAlerta('Erro ao fazer check-in', 'erro');
        });
    });
}

function fazerCheckout(reservaId) {
    mostrarConfirmacao('recepcao-checkout-confirm', () => {
        // CORREÇÃO: Enviar como FormData
        const formData = new FormData();
        formData.append('acao', 'fazer_checkout');
        formData.append('reserva_id', reservaId);
        
        fetch('api/admin/recepcao.php', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                mostrarAlerta('recepcao-checkout-sucesso', 'sucesso');
                carregarAbaRecepcao(); // Recarrega a lista
            } else {
                mostrarAlerta(data.mensagem, 'erro');
            }
        })
        .catch(error => {
            console.error('Erro no check-out:', error);
            mostrarAlerta('Erro ao fazer check-out', 'erro');
        });
    });
}

function cancelarReserva(reservaId) {
    mostrarConfirmacao('Tem certeza que deseja cancelar esta reserva?', () => {
        fetch('api/admin/cancelar_reserva_admin.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                reserva_id: reservaId 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                mostrarAlerta('Reserva cancelada com sucesso!', 'sucesso');
                carregarAbaRecepcao(); // Recarrega a lista
            } else {
                mostrarAlerta(data.mensagem, 'erro');
            }
        })
        .catch(error => {
            console.error('Erro ao cancelar reserva:', error);
            mostrarAlerta('Erro ao cancelar reserva', 'erro');
        });
    });
}




function abrirModalPagamento(reservaId) {
    mostrarAlerta('Funcionalidade em desenvolvimento', 'aviso');
}

function abrirModalConsumo(reservaId) {
    mostrarAlerta('Funcionalidade em desenvolvimento', 'aviso');
}

// ========================================================================
// ABA 2: CLIENTES (RF08, RF01) - CORRIGIDA
// ========================================================================

let clienteSelecionadoId = null; 

function carregarAbaClientes() {
    
    document.getElementById('clientes-lista-busca').innerHTML = 
        `<p>${dicionarioTextos[idiomaAtual]['clientes-digite-busca']}</p>`;
}

function ligarEventosClientes() {
    document.getElementById('btn-buscar-cliente').addEventListener('click', buscarClientes);
    
    // Buscar ao pressionar Enter
    document.getElementById('cliente-busca-termo').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarClientes();
        }
    });
}

function buscarClientes() {
    const termo = document.getElementById('cliente-busca-termo').value.trim();
    const listaContainer = document.getElementById('clientes-lista-busca');
    
    if (termo.length < 3) {
        listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['clientes-digite-busca']}</p>`;
        return;
    }
    
    listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-carregando']}</p>`;
    
    fetch(`api/admin/cliente_crud.php?acao=buscar&termo=${encodeURIComponent(termo)}`, { 
        credentials: 'include' 
    })
    .then(response => response.json())
    .then(data => {
        listaContainer.innerHTML = '';
        
        if (data.length > 0) {
            data.forEach(cliente => {
                const card = document.createElement('div');
                card.className = 'list-item-card';
                card.innerHTML = `
                    <div class="info">
                        <strong>${cliente.nome_completo}</strong>
                        <p>Email: ${cliente.email} | Documento: ${cliente.documento || 'N/D'}</p>
                        <p>Telefone: ${cliente.telefone || 'N/D'} | Nacionalidade: ${cliente.nacionalidade || 'N/D'}</p>
                    </div>
                    <div class="actions">
                        <button class="btn btn-primary btn-selecionar-cliente" data-id="${cliente.id}">
                            ${dicionarioTextos[idiomaAtual]['clientes-btn-selecionar']}
                        </button>
                    </div>
                `;
                listaContainer.appendChild(card);
            });
            
            // Liga eventos dos botões selecionar
            document.querySelectorAll('.btn-selecionar-cliente').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const clienteId = e.target.getAttribute('data-id');
                    selecionarClienteParaReserva(clienteId);
                });
            });
        } else {
            listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['clientes-nenhum-encontrado']}</p>`;
        }
    })
    .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        listaContainer.innerHTML = '<p>Erro ao buscar clientes</p>';
    });
}

function selecionarClienteParaReserva(clienteId) {
    console.log('Selecionando cliente ID:', clienteId);
    
    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(() => {
        // Verifica se os elementos existem antes de usar
        const nomeElement = document.getElementById('cliente-selecionado-nome');
        const formElement = document.getElementById('form-nova-reserva-balcao');
        
        console.log('Elementos encontrados:');
        console.log('- cliente-selecionado-nome:', nomeElement);
        console.log('- form-nova-reserva-balcao:', formElement);
        
        if (!nomeElement || !formElement) {
            console.error('Elementos do formulário não encontrados');
            mostrarAlerta('Erro: Elementos do formulário não encontrados', 'erro');
            return;
        }
        
        // Busca dados completos do cliente
        const url = `api/admin/cliente_crud.php?acao=detalhes&id=${clienteId}`;
        console.log('URL detalhes cliente:', url);
        
        fetch(url, { 
            credentials: 'include' 
        })
        .then(response => {
            console.log('Status resposta detalhes:', response.status);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(cliente => {
            console.log('Dados do cliente recebidos:', cliente);
            
            if (cliente && cliente.id) {
                clienteSelecionadoId = clienteId;
                nomeElement.textContent = cliente.nome_completo;
                formElement.classList.remove('hidden');
                
                // Scroll para o formulário
                formElement.scrollIntoView({ behavior: 'smooth' });
                
                console.log('Cliente selecionado com sucesso:', cliente.nome_completo);
            } else {
                throw new Error('Dados do cliente incompletos');
            }
        })
        .catch(error => {
            console.error('❌ Erro ao carregar detalhes do cliente:', error);
            mostrarAlerta('Erro ao carregar dados do cliente: ' + error.message, 'erro');
        });
    }, 100); // Pequeno delay de 100ms
}
// ========================================================================
// ABA 3: RESERVAS - CORRIGIDA
// ========================================================================

function carregarAbaReservas() {
    // Carrega reservas automaticamente ao entrar na aba
    buscarReservas();
}

function ligarEventosReservas() {
    document.getElementById('btn-buscar-reservas').addEventListener('click', buscarReservas);
}

function buscarReservas() {
    const status = document.getElementById('reserva-busca-status').value;
    const cliente = document.getElementById('reserva-busca-cliente').value.trim();
    const checkinMin = document.getElementById('reserva-busca-checkin').value;
    const checkoutMax = document.getElementById('reserva-busca-checkout').value;
    
    let url = `api/admin/reserva_crud.php?acao=listar`;
    const params = [];
    
    if (status) params.push(`status=${status}`);
    if (cliente) params.push(`cliente=${encodeURIComponent(cliente)}`);
    if (checkinMin) params.push(`checkin_min=${checkinMin}`);
    if (checkoutMax) params.push(`checkout_max=${checkoutMax}`);
    
    if (params.length > 0) {
        url += '&' + params.join('&');
    }
    
    const listaContainer = document.getElementById('todas-reservas-lista');
    listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-carregando']}</p>`;
    
    fetch(url, { credentials: 'include' })
    .then(response => response.json())
    .then(data => {
        listaContainer.innerHTML = '';
        
        if (data.length > 0) {
            data.forEach(reserva => {
                const card = document.createElement('div');
                card.className = 'list-item-card';
                
                const statusClass = `status-${reserva.status.toLowerCase()}`;
                const checkin = formatarData(reserva.data_checkin);
                const checkout = formatarData(reserva.data_checkout);
                
                card.innerHTML = `
                    <div class="info">
                        <strong>${reserva.nome_cliente || 'Cliente não encontrado'}</strong>
                        <span class="status-badge ${statusClass}">${reserva.status}</span>
                        <p>Check-in: ${checkin} | Check-out: ${checkout}</p>
                        <p>Quarto: ${reserva.nome_quarto || 'N/D'} | Vaga: ${reserva.nome_vaga || 'N/D'}</p>
                        <p>Valor: R$ ${reserva.valor_total || '0.00'} | Criação: ${formatarData(reserva.data_criacao)}</p>
                    </div>
                `;
                listaContainer.appendChild(card);
            });
        } else {
            listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['reservas-nenhuma-encontrada']}</p>`;
        }
    })
    .catch(error => {
        console.error('Erro ao buscar reservas:', error);
        listaContainer.innerHTML = '<p>Erro ao carregar reservas</p>';
    });
}

// ========================================================================
// ABA 4: GESTÃO DE QUARTOS (RF03)
// ========================================================================

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
                    // Sua nova lógica de datas
                    const dataEntrada = quarto.data_entrada ? new Date(quarto.data_entrada).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Hoje';
                    const dataSaida = quarto.data_saida ? new Date(quarto.data_saida).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Indefinido';
                    card.innerHTML = `
                        <div class="info">
                            <strong>${quarto.nome} (${quarto.tipo || 'N/D'})</strong>
                            <p>Capacidade: ${quarto.capacidade} camas | Preço: R$ ${quarto.preco_diaria}</p>
                            <p>Banheiro: ${quarto.tem_banheiro ? 'Sim' : 'Não'} | Tipo: ${quarto.tipo || 'N/D'}</p>
                            <p>Disponível de ${dataEntrada} até ${dataSaida}</p>
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
        
        // Limpa mensagens de erro
        quartoFormMessage.style.display = 'none';
        quartoFormMessage.classList.add('hidden');
        quartoFormMessage.innerText = '';
        
        // Define a data de entrada padrão como hoje (após o reset)
        setTimeout(() => {
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('quarto-data-entrada').value = hoje;
            document.getElementById('quarto-saida-indefinida').checked = true;
            document.getElementById('quarto-data-saida').disabled = true;
            document.getElementById('quarto-data-saida').value = '';
            document.getElementById('quarto-tem-banheiro').checked = false; // Garante que o checkbox de banheiro esteja desmarcado
            document.getElementById('quarto-tipo').value = 'MISTO'; // Define um padrão
        }, 10);
        
        modalQuarto.classList.add('active');
    });
    
    // Evento para checkbox de saída indefinida
    document.getElementById('quarto-saida-indefinida').addEventListener('change', (e) => {
        const dataSaidaInput = document.getElementById('quarto-data-saida');
        if (e.target.checked) {
            dataSaidaInput.disabled = true;
            dataSaidaInput.value = '';
        } else {
            dataSaidaInput.disabled = false;
        }
    });
    
    document.getElementById('btn-fechar-quarto-modal').addEventListener('click', () => {
        modalQuarto.classList.remove('active');
    });

    // --- Evento de Salvar (Criar ou Editar) ---
    formQuarto.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Limpa mensagens de erro anteriores
        quartoFormMessage.style.display = 'none';
        quartoFormMessage.classList.add('hidden');
        
        // Validação básica (sua lógica estava ótima)
        const nome = document.getElementById('quarto-nome').value.trim();
        const capacidade = parseInt(document.getElementById('quarto-capacidade').value);
        const preco = parseFloat(document.getElementById('quarto-preco-diaria').value);
        const tipo = document.getElementById('quarto-tipo').value; // <-- Campo que faltava
        
        if (!nome) {
            quartoFormMessage.innerText = 'O nome do quarto é obrigatório.';
            quartoFormMessage.style.display = 'block';
            quartoFormMessage.classList.remove('hidden');
            return;
        }
         if (!tipo) { // <-- Validação do tipo
            quartoFormMessage.innerText = 'O tipo do quarto (Misto, Feminino, etc.) é obrigatório.';
            quartoFormMessage.style.display = 'block';
            quartoFormMessage.classList.remove('hidden');
            return;
        }
        if (!capacidade || capacidade < 1) {
            quartoFormMessage.innerText = 'A capacidade deve ser maior que zero.';
            quartoFormMessage.style.display = 'block';
            quartoFormMessage.classList.remove('hidden');
            return;
        }
        if (!preco || preco <= 0) {
            quartoFormMessage.innerText = 'O preço deve ser maior que zero.';
            quartoFormMessage.style.display = 'block';
            quartoFormMessage.classList.remove('hidden');
            return;
        }
        
        const saidaIndefinida = document.getElementById('quarto-saida-indefinida').checked;
        
        // ================== CORREÇÃO ==================
        // Objeto de dados alinhado com o HTML e o PHP que corrigimos
        const dadosQuarto = {
            nome: nome,
            capacidade: capacidade,
            preco_diaria: preco,
            descricao_pt: document.getElementById('quarto-desc-pt').value.trim() || '',
            descricao_en: document.getElementById('quarto-desc-en').value.trim() || '',
            
            // Campos que sincronizamos
            tipo: tipo, 
            tem_banheiro: document.getElementById('quarto-tem-banheiro').checked, // (true ou false)

            // Seus novos campos de data
            data_entrada: document.getElementById('quarto-data-entrada').value || new Date().toISOString().split('T')[0],
            data_saida: saidaIndefinida ? null : (document.getElementById('quarto-data-saida').value || null),
        };
        // ================== FIM DA CORREÇÃO ==================
        
        console.log('Enviando dados do quarto:', dadosQuarto);
        
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
        .then(async response => {
            // Sua lógica de parse de erro está ótima
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Resposta não é JSON válido:', text);
                console.error('Erro de parse:', e);
                throw new Error('A API retornou uma resposta inválida. Verifique o console do navegador (F12) para mais detalhes. Possível causa: erro PHP ou colunas faltando no banco de dados.');
            }
            return data;
        })
        .then(data => {
            console.log('Resposta da API:', data);
            if (data.status === 'sucesso') {
                mostrarAlerta(dicionarioTextos[idiomaAtual]['quarto-salvo-sucesso'], 'sucesso');
                modalQuarto.classList.remove('active');
                formQuarto.reset();
                carregarAbaGestaoQuartos(); 
            } else {
                quartoFormMessage.innerText = data.mensagem || 'Erro ao salvar quarto.';
                quartoFormMessage.style.display = 'block';
                quartoFormMessage.classList.remove('hidden');
            }
        })
        .catch(err => {
            console.error('Erro ao salvar quarto:', err);
            quartoFormMessage.innerText = 'Erro de conexão com a API: ' + err.message;
            quartoFormMessage.style.display = 'block';
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
            
            // Busca os dados completos do quarto
            fetch(`api/admin/quarto_crud.php?acao=listar`, { credentials: 'include' })
                .then(response => response.json())
                .then(quartos => {
                    const quarto = quartos.find(q => q.id == quartoId);
                    if (quarto) {
                        // ================== CORREÇÃO ==================
                        // Preenche todos os campos sincronizados
                        document.getElementById('quarto-nome').value = quarto.nome || '';
                        document.getElementById('quarto-tipo').value = quarto.tipo || 'MISTO'; // Preenche o tipo
                        document.getElementById('quarto-capacidade').value = quarto.capacidade || '';
                        document.getElementById('quarto-preco-diaria').value = quarto.preco_diaria || '';
                        document.getElementById('quarto-desc-pt').value = quarto.descricao_pt || '';
                        document.getElementById('quarto-desc-en').value = quarto.descricao_en || '';
                        document.getElementById('quarto-tem-banheiro').checked = !!quarto.tem_banheiro; // Preenche o checkbox
                        
                        // Sua lógica de datas (está ótima)
                        if (quarto.data_entrada) {
                            const dataEntradaFormatada = quarto.data_entrada.split(' ')[0];
                            document.getElementById('quarto-data-entrada').value = dataEntradaFormatada;
                        } else {
                            document.getElementById('quarto-data-entrada').value = new Date().toISOString().split('T')[0];
                        }
                        if (quarto.data_saida) {
                            const dataSaidaFormatada = quarto.data_saida.split(' ')[0];
                            document.getElementById('quarto-data-saida').value = dataSaidaFormatada;
                            document.getElementById('quarto-saida-indefinida').checked = false;
                            document.getElementById('quarto-data-saida').disabled = false;
                        } else {
                            document.getElementById('quarto-data-saida').value = '';
                            document.getElementById('quarto-saida-indefinida').checked = true;
                            document.getElementById('quarto-data-saida').disabled = true;
                        }
                        // ================== FIM DA CORREÇÃO ==================
                    }
                });
            
            quartoFormTitulo.innerText = `${dicionarioTextos[idiomaAtual]['quartos-modal-titulo-editar']} #${quartoId}`;
            quartoFormMessage.classList.add('hidden');
            modalQuarto.classList.add('active');
        }
    });
}

// ========================================================================
// ABA 5: GESTÃO DE VAGAS (RF03)
// ========================================================================

let quartoIdSelecionadoParaVagas = null; // Guarda o ID do quarto em foco

/**
 * (Vagas) Carrega a aba, populando o dropdown de quartos.
 */
function carregarAbaGestaoVagas() {
    const selectQuarto = document.getElementById('vaga-select-quarto');
    const detalheContainer = document.getElementById('vagas-detalhe-container');

    // Reseta a aba
    selectQuarto.innerHTML = '<option value="">Carregando quartos...</option>';
    detalheContainer.classList.add('hidden');
    
    // Busca os quartos (da mesma forma que a aba de Gestão de Quartos)
    fetch('api/admin/quarto_crud.php?acao=listar', { credentials: 'include' })
        .then(response => response.json())
        .then(quartos => {
            selectQuarto.innerHTML = '<option value="">-- Selecione um Quarto --</option>';
            if (quartos.length > 0) {
                quartos.forEach(quarto => {
                    const option = document.createElement('option');
                    option.value = quarto.id;
                    option.text = `${quarto.nome} (Cap: ${quarto.capacidade})`;
                    option.dataset.nome = quarto.nome; // Guarda o nome
                    selectQuarto.appendChild(option);
                });
            } else {
                selectQuarto.innerHTML = '<option value="">Nenhum quarto cadastrado</option>';
            }
        });
}

/**
 * (Vagas) Carrega a lista de vagas e o formulário para um quarto específico.
 */
function carregarDetalhesVagas(quartoId, quartoNome) {
    quartoIdSelecionadoParaVagas = quartoId; // Salva o ID do quarto
    
    const detalheContainer = document.getElementById('vagas-detalhe-container');
    const listaContainer = document.getElementById('vagas-lista');
    
    // Atualiza os títulos e IDs
    document.getElementById('vaga-quarto-selecionado-nome').innerText = `Vagas no Quarto: ${quartoNome}`;
    document.getElementById('vaga-fk-quarto-id').value = quartoId; // Seta o ID no form hidden
    detalheContainer.classList.remove('hidden');
    
    listaContainer.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['recepcao-carregando']}</p>`;
    
    // Busca as vagas deste quarto
    fetch(`api/admin/vaga_crud.php?acao=listar_por_quarto&quarto_id=${quartoId}`, { credentials: 'include' })
        .then(response => response.json())
        .then(vagas => {
            listaContainer.innerHTML = ''; // Limpa o "carregando"
            
            if (vagas.length > 0) {
                vagas.forEach(vaga => {
                    const card = document.createElement('div');
                    card.className = 'list-item-card';
                    card.innerHTML = `
                        <div class="info">
                            <strong>${vaga.nome_identificador}</strong>
                            <p>${vaga.descricao_peculiaridades_pt || 'Sem descrição.'}</p>
                        </div>
                        <div class="actions">
                            <button class="btn btn-cancelar btn-excluir-vaga" data-id="${vaga.id}">Excluir</button>
                        </div>
                    `;
                    listaContainer.appendChild(card);
                });
            } else {
                listaContainer.innerHTML = `<p>Nenhuma vaga (cama) cadastrada neste quarto ainda.</p>`;
            }
        });
}

/**
 * (Vagas) Liga os eventos da aba (dropdown, form submit, delete)
 */
function ligarEventosGestaoVagas() {
    
    // Evento 1: Mudança no Dropdown de Quarto
    document.getElementById('vaga-select-quarto').addEventListener('change', (e) => {
        const select = e.target;
        const quartoId = select.value;
        
        if (quartoId) {
            const quartoNome = select.options[select.selectedIndex].dataset.nome;
            carregarDetalhesVagas(quartoId, quartoNome);
        } else {
            // Esconde o container se "Selecione..." for escolhido
            document.getElementById('vagas-detalhe-container').classList.add('hidden');
            quartoIdSelecionadoParaVagas = null;
        }
    });
    
    // Evento 2: Submit do Formulário de Nova Vaga
    document.getElementById('form-nova-vaga').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const dadosVaga = {
            fk_quarto_id: document.getElementById('vaga-fk-quarto-id').value,
            nome_identificador: document.getElementById('vaga-nome-identificador').value,
            descricao_pt: document.getElementById('vaga-descricao-pt').value,
            descricao_en: document.getElementById('vaga-descricao-en').value
        };

        fetch('api/admin/vaga_crud.php', {
            method: 'POST', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ acao: 'criar', dados: dadosVaga })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                mostrarAlerta('Vaga (cama) adicionada com sucesso!', 'sucesso');
                // Limpa o formulário de nova vaga, mas mantém a seleção do quarto
                document.getElementById('vaga-nome-identificador').value = '';
                document.getElementById('vaga-descricao-pt').value = '';
                document.getElementById('vaga-descricao-en').value = '';

                // Recarrega apenas a lista de vagas
                carregarDetalhesVagas(quartoIdSelecionadoParaVagas, document.getElementById('vaga-quarto-selecionado-nome').innerText.replace('Vagas no Quarto: ', ''));
            } else {
                mostrarAlerta(data.mensagem, 'erro'); // Ex: "Vaga duplicada"
            }
        });
    });
    
    // Evento 3: Clique no botão Excluir Vaga (Delegação de Evento)
    document.getElementById('vagas-lista').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-excluir-vaga')) {
            const vagaId = e.target.getAttribute('data-id');
            
            mostrarConfirmacao('Tem certeza que quer excluir esta vaga (cama)?', () => {
                fetch('api/admin/vaga_crud.php', {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ acao: 'excluir', id: vagaId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        mostrarAlerta('Vaga excluída!', 'sucesso');
                        carregarDetalhesVagas(quartoIdSelecionadoParaVagas, document.getElementById('vaga-quarto-selecionado-nome').innerText.replace('Vagas no Quarto: ', ''));
                    } else {
                        mostrarAlerta(data.mensagem, 'erro'); // Ex: "Tem reserva ativa"
                    }
                });
            });
        }
    });
}