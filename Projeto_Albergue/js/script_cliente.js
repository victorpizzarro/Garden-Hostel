/**
 * Arquivo: /js/script_cliente.js
 * Descrição: Lógica do Painel do Cliente (painel_cliente.html)
 * (Versão Final - Com modais customizados, perfil editável e tradução)
 */

// ========================================================================
// DICIONÁRIO DE IDIOMAS (RF10)
// ========================================================================
const dicionarioTextos = {
    'pt': {
        'saudacao': 'Olá', 'btn-sair': '(Sair)', 'menu-titulo': 'Minha Conta', 'menu-reservas': 'Minhas Reservas', 'menu-perfil': 'Meu Perfil',
        'cliente-reservas-titulo': 'Minhas Reservas', 'cliente-perfil-titulo': 'Meu Perfil', 'btn-pagar': 'Pagar Agora', 'btn-cancelar': 'Cancelar',
        'btn-avaliar': 'Avaliar Estadia', 'btn-ver-avaliacao': 'Ver Avaliação', 'confirm-cancelar': 'Tem certeza que deseja cancelar esta reserva?',
        'perfil-dados-pessoais': 'Dados Pessoais', 'perfil-endereco': 'Meu Endereço (Opcional)', 'perfil-cep': 'CEP', 'perfil-logradouro': 'Logradouro',
        'perfil-mudar-senha': 'Mudar Senha', 'perfil-senha-antiga': 'Senha Antiga', 'perfil-nova-senha': 'Nova Senha',
        'perfil-btn-salvar': 'Salvar Alterações', 'perfil-btn-editar': 'Editar Perfil', 'perfil-btn-cancelar-edicao': 'Cancelar',
        'aval-titulo': 'Avalie sua Estadia', 'aval-nota': 'Nota (1 a 5)', 'aval-comentario': 'Comentário', 'aval-btn-enviar': 'Enviar Avaliação',
        'reserva-titulo': 'Reserva', 'reserva-valor': 'Valor', 'status-PENDENTE': 'PENDENTE', 'status-CONFIRMADA': 'CONFIRMADA',
        'status-CHECKIN': 'CHECK-IN', 'status-FINALIZADA': 'FINALIZADA', 'status-CANCELADA': 'CANCELADA',
        'reg-celular': 'Celular (com DDD)',
        'alerta-titulo-aviso': 'Aviso', 'alerta-titulo-sucesso': 'Sucesso', 'alerta-titulo-erro': 'Erro',
        'alerta-pag-sucesso': 'Pagamento confirmado! Sua reserva está CONFIRMADA.',
        'alerta-canc-sucesso': 'Reserva cancelada com sucesso!',
        'alerta-aval-sucesso': 'Avaliação enviada com sucesso! Obrigado.',
        'alerta-aval-ver-funcionalidade': 'Funcionalidade "Ver Avaliação" ainda a ser implementada.',
        'confirm-sim': 'Sim', 'confirm-nao': 'Não', 'aval-ver-fechar': 'Fechar Avaliação'
    },
    'en': {
        'saudacao': 'Hello', 'btn-sair': '(Logout)', 'menu-titulo': 'My Account', 'menu-reservas': 'My Reservations', 'menu-perfil': 'My Profile',
        'cliente-reservas-titulo': 'My Reservations', 'cliente-perfil-titulo': 'My Profile', 'btn-pagar': 'Pay Now', 'btn-cancelar': 'Cancel',
        'btn-avaliar': 'Rate Stay', 'btn-ver-avaliacao': 'View Review', 'confirm-cancelar': 'Are you sure you want to cancel this reservation?',
        'perfil-dados-pessoais': 'Personal Data', 'perfil-endereco': 'My Address (Optional)', 'perfil-cep': 'ZIP Code', 'perfil-logradouro': 'Address',
        'perfil-mudar-senha': 'Change Password', 'perfil-senha-antiga': 'Old Password', 'perfil-nova-senha': 'New Password',
        'perfil-btn-salvar': 'Save Changes', 'perfil-btn-editar': 'Edit Profile', 'perfil-btn-cancelar-edicao': 'Cancel',
        'aval-titulo': 'Rate Your Stay', 'aval-nota': 'Rating (1 to 5)', 'aval-comentario': 'Comment', 'aval-btn-enviar': 'Submit Review',
        'reserva-titulo': 'Reservation', 'reserva-valor': 'Price', 'status-PENDENTE': 'PENDING', 'status-CONFIRMADA': 'CONFIRMED',
        'status-CHECKIN': 'CHECKED-IN', 'status-FINALIZADA': 'COMPLETED', 'status-CANCELADA': 'CANCELLED',
        'reg-celular': 'Phone (with area code)',
        'alerta-titulo-aviso': 'Notice', 'alerta-titulo-sucesso': 'Success', 'alerta-titulo-erro': 'Error',
        'alerta-pag-sucesso': 'Payment confirmed! Your reservation is CONFIRMED.',
        'alerta-canc-sucesso': 'Reservation cancelled successfully!',
        'alerta-aval-sucesso': 'Review submitted successfully! Thank you.',
        'alerta-aval-ver-funcionalidade': '"View Review" functionality is not yet implemented.',
        'confirm-sim': 'Yes', 'confirm-nao': 'No', 'aval-ver-fechar': 'Close Review'
    }
};

// ========================================================================
// SCRIPT PRINCIPAL
// ========================================================================

let idiomaAtual = localStorage.getItem('idioma') || 'pt';
let nomeUsuarioLogado = ''; // Guarda o nome do usuário

/**
 * Função: aplicarTraducoes
 * Descrição: Varre o dicionário e troca os textos estáticos da página
 */
function aplicarTraducoes() {
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (dicionarioTextos[idiomaAtual][key]) {
            elem.innerText = dicionarioTextos[idiomaAtual][key];
        }
    });
    document.body.classList.add('js-traduzido');
    
    // Atualiza a saudação (Olá, Nome)
    const saudacao = dicionarioTextos[idiomaAtual]['saudacao'];
    document.getElementById('user-welcome').innerText = `${saudacao}, ${nomeUsuarioLogado}`;
}

// ========================================================================
// FUNÇÕES GLOBAIS DE AJUDA
// ========================================================================

/**
 * Formata um valor de celular (enquanto digita)
 */
function formatarCelular(valor) {
    if (!valor) return '';
    valor = valor.replace(/\D/g, ''); 
    valor = valor.substring(0, 11); 
    if (valor.length === 11) {
        return valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 6) { 
        return valor.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    } else if (valor.length > 2) { 
        return valor.replace(/(\d{2})(\d{1,4})/, '($1) $2');
    } else if (valor.length > 0) { 
        return valor.replace(/(\d{1,2})/, '($1');
    }
    return valor;
}
/**
 * Formata um valor de CEP (enquanto digita)
 */
function formatarCEP(valor) {
    if (!valor) return '';
    valor = valor.replace(/\D/g, ''); 
    valor = valor.substring(0, 8); 
    if (valor.length > 5) {
        return valor.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    return valor;
}

/**
 * Mostra a mensagem temporária no formulário "Meu Perfil"
 */
let timeoutMensagem; 
function mostrarMensagem(elemento, mensagem, tipo) {
    elemento.innerText = mensagem;
    elemento.className = 'error-message'; // Reseta
    if (tipo === 'sucesso') {
        elemento.classList.add('message-sucesso');
    } else {
        elemento.classList.add('message-erro');
    }
    elemento.style.display = 'block';

    if (timeoutMensagem) clearTimeout(timeoutMensagem);
    timeoutMensagem = setTimeout(() => {
        elemento.style.display = 'none';
    }, 4000);
}

/**
 * Mostra um Alerta (Popup) customizado
 */
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
// Ouve o clique no botão "OK" do modal de alerta
alertaOkBtn.addEventListener('click', () => {
    modalAlerta.classList.remove('active');
});

/**
 * Mostra uma Confirmação (Popup) customizada
 */
const modalConfirmacao = document.getElementById('modal-confirmacao');
const confirmTitulo = document.getElementById('confirm-titulo');
const confirmTexto = document.getElementById('confirm-texto');
const confirmBtnSim = document.getElementById('confirm-btn-sim');
const confirmBtnNao = document.getElementById('confirm-btn-nao');

function mostrarConfirmacao(mensagemKey, callback) {
    // Traduz
    confirmTitulo.innerText = dicionarioTextos[idiomaAtual]['alerta-titulo-aviso'];
    confirmTexto.innerText = dicionarioTextos[idiomaAtual][mensagemKey];
    confirmBtnSim.innerText = dicionarioTextos[idiomaAtual]['confirm-sim'];
    confirmBtnNao.innerText = dicionarioTextos[idiomaAtual]['confirm-nao'];
    
    modalConfirmacao.classList.add('active');
    
    // Ouve o clique no "Não" (só fecha)
    confirmBtnNao.onclick = () => {
        modalConfirmacao.classList.remove('active');
    };
    
    // Ouve o clique no "Sim" (fecha e executa a ação)
    confirmBtnSim.onclick = () => {
        modalConfirmacao.classList.remove('active');
        callback(); // Executa a ação de cancelamento
    };
}


// ========================================================================
// FUNÇÕES DE CARREGAMENTO DE DADOS (API)
// ========================================================================

/**
 * Função: carregarMinhasReservas
 * Descrição: Busca na API as reservas do cliente e as exibe.
 */
function carregarMinhasReservas() {
    const listaContainer = document.getElementById('reservas-lista');
    listaContainer.innerHTML = "<p>Carregando...</p>";

    fetch('api/reserva/minhas_reservas.php', { method: 'GET', credentials: 'include' })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'erro' || data.length === 0) {
            listaContainer.innerHTML = "<p>Você ainda não possui reservas.</p>";
            return;
        }

        listaContainer.innerHTML = ''; 
        data.forEach(reserva => {
            const card = document.createElement('div');
            card.className = 'reserva-card'; 
            card.classList.add(`status-${reserva.status_reserva.toLowerCase()}`); 

            const txtReserva = dicionarioTextos[idiomaAtual]['reserva-titulo'];
            const txtStatus = dicionarioTextos[idiomaAtual][`status-${reserva.status_reserva}`] || reserva.status_reserva;
            const txtValor = dicionarioTextos[idiomaAtual]['reserva-valor'];

            card.innerHTML = `
                <div class="reserva-header">
                    <strong>${txtReserva} #${reserva.reserva_id}</strong>
                    <span class="reserva-status">${txtStatus}</span>
                </div>
                <div class="reserva-body">
                    <p><strong>Check-in:</strong> ${reserva.data_checkin}</p>
                    <p><strong>Check-out:</strong> ${reserva.data_checkout}</p>
                    <p><strong>${txtValor}:</strong> R$ ${reserva.valor_total_diarias}</p>
                </div>
                <div class="reserva-actions" id="actions-${reserva.reserva_id}"></div>
                <div class="avaliacao-detalhe" id="detalhe-aval-${reserva.reserva_id}"></div>
            `;
            listaContainer.appendChild(card);
            
            const actionsContainer = document.getElementById(`actions-${reserva.reserva_id}`);
            const btnPagarTexto = dicionarioTextos[idiomaAtual]['btn-pagar'];
            const btnCancelarTexto = dicionarioTextos[idiomaAtual]['btn-cancelar'];
            const btnAvaliarTexto = dicionarioTextos[idiomaAtual]['btn-avaliar'];
            const btnVerAvaliacaoTexto = dicionarioTextos[idiomaAtual]['btn-ver-avaliacao'];
            
            if (reserva.status_reserva === 'PENDENTE') {
                actionsContainer.innerHTML = `<button class="btn btn-pagar" data-id="${reserva.reserva_id}">${btnPagarTexto}</button> <button class="btn btn-cancelar" data-id="${reserva.reserva_id}">${btnCancelarTexto}</button>`;
            }
            else if (reserva.status_reserva === 'CONFIRMADA') {
                 actionsContainer.innerHTML = `<button class="btn btn-cancelar" data-id="${reserva.reserva_id}">${btnCancelarTexto}</button>`;
            }
            else if (reserva.status_reserva === 'FINALIZADA') {
                if (reserva.avaliacao_id !== null) {
                    actionsContainer.innerHTML = `<button class="btn btn-ver-avaliacao" data-id="${reserva.reserva_id}">${btnVerAvaliacaoTexto}</button>`;
                } else {
                    actionsContainer.innerHTML = `<button class="btn btn-avaliar" data-id="${reserva.reserva_id}">${btnAvaliarTexto}</button>`;
                }
            }
        });
    })
    .catch(error => {
        console.error('Erro ao buscar reservas:', error);
        listaContainer.innerHTML = "<p>Erro de conexão ao buscar suas reservas.</p>";
    });
}

/**
 * Função: carregarDadosPerfil
 * Descrição: Busca os dados do perfil na API e preenche o formulário.
 */
function carregarDadosPerfil() {
    fetch('api/usuario/perfil_get.php', { method: 'GET', credentials: 'include' })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'erro') return;
        
        // Aplica a formatação "feita à mão"
        document.getElementById('perfil-celular').value = formatarCelular(data.telefone_celular);
        document.getElementById('perfil-cep').value = formatarCEP(data.cep);
        document.getElementById('perfil-logradouro').value = data.logradouro || '';
    })
    .catch(error => console.error('Erro ao buscar dados do perfil:', error));
}

// ========================================================================
// INÍCIO DO DOMContentLoaded
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. O "PORTÃO DE SEGURANÇA" ---
    fetch('api/usuario/checar_sessao.php', { method: 'GET', credentials: 'include' })
    .then(response => response.json())
    .then(data => {
        if (!data.logado || data.tipo_usuario !== 'CLIENTE') {
            window.location.href = 'login.html';
        } else {
            nomeUsuarioLogado = data.nome; 
            iniciarPagina(); 
        }
    })
    .catch(error => {
        console.error('Erro na checagem de sessão:', error);
        window.location.href = 'login.html';
    });
});

/**
 * Função: iniciarPagina
 * (Chamada após a checagem de segurança)
 */
function iniciarPagina() {
    
    // --- Lógica de Idioma ---
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
    aplicarTraducoes(); 

    btnPt.addEventListener('click', () => {
        idiomaAtual = 'pt'; localStorage.setItem('idioma', 'pt');
        atualizarBotoesIdioma(); aplicarTraducoes(); carregarMinhasReservas();
    });
    btnEn.addEventListener('click', () => {
        idiomaAtual = 'en'; localStorage.setItem('idioma', 'en');
        atualizarBotoesIdioma(); aplicarTraducoes(); carregarMinhasReservas();
    });

    // --- Lógica de Logout ---
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        fetch('api/usuario/logout.php', { method: 'GET', credentials: 'include' })
            .then(() => { window.location.href = 'index.html'; });
    });

    // --- Lógica de Navegação das Abas ---
    const navReservas = document.getElementById('nav-reservas');
    const navPerfil = document.getElementById('nav-perfil');
    const secaoReservas = document.getElementById('conteudo-reservas');
    const secaoPerfil = document.getElementById('conteudo-perfil');

    navReservas.addEventListener('click', (e) => {
        e.preventDefault();
        secaoReservas.classList.remove('hidden');
        secaoPerfil.classList.add('hidden');
        navReservas.classList.add('active');
        navPerfil.classList.remove('active');
    });
    navPerfil.addEventListener('click', (e) => {
        e.preventDefault();
        secaoReservas.classList.add('hidden');
        secaoPerfil.classList.remove('hidden');
        navReservas.classList.remove('active');
        navPerfil.classList.add('active');
    });

    // --- Lógica de Carregamento de Dados ---
    carregarMinhasReservas();
    carregarDadosPerfil(); 

    // --- Lógica dos Botões de Ação (Pagar, Cancelar, Avaliar) ---
    const modalAvaliacao = document.getElementById('modal-avaliacao');
    
    document.getElementById('reservas-lista').addEventListener('click', (e) => {
        
        // --- AÇÃO: CANCELAR (Usa Modal de Confirmação) ---
        if (e.target.classList.contains('btn-cancelar')) {
            const reservaId = e.target.getAttribute('data-id');
            
            // 1. Mostra o modal de confirmação
            mostrarConfirmacao('confirm-cancelar', () => {
                // 2. Esta função (callback) só roda se o usuário clicar "Sim"
                fetch('api/reserva/cancelar_reserva.php', { 
                    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ reserva_id: reservaId }) 
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'sucesso') {
                        mostrarAlerta('alerta-canc-sucesso', 'sucesso');
                        carregarMinhasReservas(); 
                    } else {
                        mostrarAlerta(data.mensagem, 'erro'); // Mostra o erro da API (ex: "fora do prazo")
                    }
                })
                .catch(error => console.error('Erro ao cancelar:', error));
            });
        }

        // --- AÇÃO: PAGAR AGORA ---
        if (e.target.classList.contains('btn-pagar')) {
            const reservaId = e.target.getAttribute('data-id');
            fetch('api/reserva/pagar_reserva.php', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reserva_id: reservaId }) })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'sucesso') {
                    mostrarAlerta('alerta-pag-sucesso', 'sucesso');
                    carregarMinhasReservas(); 
                } else {
                    mostrarAlerta(data.mensagem, 'erro');
                }
            })
            .catch(error => console.error('Erro ao pagar:', error));
        }

        // --- AÇÃO: AVALIAR (Abre Modal) ---
        if (e.target.classList.contains('btn-avaliar')) {
            const reservaId = e.target.getAttribute('data-id');
            document.getElementById('avaliacao-reserva-id').value = reservaId;
            document.getElementById('form-avaliacao').reset();
            document.getElementById('avaliacao-message').style.display = 'none';
            modalAvaliacao.classList.add('active');
        }
        
        // --- AÇÃO: Ver Avaliação (Expande o Card) ---
        if (e.target.classList.contains('btn-ver-avaliacao')) {
            const reservaId = e.target.getAttribute('data-id');
            const detalheDiv = document.getElementById(`detalhe-aval-${reservaId}`);
            
            if (detalheDiv.style.display === 'block') {
                detalheDiv.style.display = 'none';
                e.target.innerText = dicionarioTextos[idiomaAtual]['btn-ver-avaliacao'];
            } else {
                fetch(`api/avaliacao/get_by_reserva.php?reserva_id=${reservaId}`, { method: 'GET', credentials: 'include' })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'erro') {
                        detalheDiv.innerHTML = `<p style="color: red;">${data.mensagem}</p>`;
                    } else {
                        detalheDiv.innerHTML = `
                            <div class="nota">${dicionarioTextos[idiomaAtual]['aval-nota']}: ${data.nota} / 5</div>
                            <div class="comentario">"${data.comentario}"</div>
                        `;
                    }
                    detalheDiv.style.display = 'block';
                    e.target.innerText = dicionarioTextos[idiomaAtual]['aval-ver-fechar'];
                })
                .catch(error => {
                    detalheDiv.innerHTML = `<p style="color: red;">Erro ao buscar avaliação.</p>`;
                    detalheDiv.style.display = 'block';
                });
            }
        }
    });

    // --- Lógica da Aba "Meu Perfil" ---
    const btnEditarPerfil = document.getElementById('btn-editar-perfil');
    const btnSalvarPerfil = document.getElementById('btn-salvar-perfil');
    const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
    
    const perfilCelular = document.getElementById('perfil-celular');
    const perfilCep = document.getElementById('perfil-cep');
    const perfilLogradouro = document.getElementById('perfil-logradouro');
    const perfilSenhaAntiga = document.getElementById('perfil-senha-antiga');
    const perfilNovaSenha = document.getElementById('perfil-nova-senha');
    const perfilMessage = document.getElementById('perfil-message');

    // Máscaras "ao digitar"
    perfilCelular.addEventListener('input', (e) => { e.target.value = formatarCelular(e.target.value); });
    perfilCep.addEventListener('input', (e) => { e.target.value = formatarCEP(e.target.value); });

    // Função para travar/destravar os campos
    function toggleEdicaoPerfil(habilitar) {
        perfilCelular.disabled = !habilitar;
        perfilCep.disabled = !habilitar;
        perfilLogradouro.disabled = !habilitar;
        perfilSenhaAntiga.disabled = !habilitar;
        perfilNovaSenha.disabled = !habilitar;

        btnEditarPerfil.classList.toggle('hidden', habilitar);
        btnSalvarPerfil.classList.toggle('hidden', !habilitar);
        btnCancelarEdicao.classList.toggle('hidden', !habilitar);
    }
    
    btnEditarPerfil.addEventListener('click', (e) => {
        e.preventDefault();
        toggleEdicaoPerfil(true); 
    });

    btnCancelarEdicao.addEventListener('click', (e) => {
        e.preventDefault();
        toggleEdicaoPerfil(false); 
        carregarDadosPerfil(); 
        perfilMessage.style.display = 'none'; 
    });

    btnSalvarPerfil.addEventListener('click', (e) => {
        e.preventDefault(); // (Bug 1) Impede o form de recarregar a página
        
        const dadosPerfil = {
            telefone_celular: perfilCelular.value.replace(/\D/g, ''),
            endereco: {
                cep: perfilCep.value.replace(/\D/g, ''),
                logradouro: perfilLogradouro.value
            }
        };

        if (perfilNovaSenha.value) {
            if (!perfilSenhaAntiga.value) {
                mostrarMensagem(perfilMessage, 'Para mudar a senha, você deve digitar sua senha antiga.', 'erro');
                return;
            }
            dadosPerfil.senha_antiga = perfilSenhaAntiga.value;
            dadosPerfil.nova_senha = perfilNovaSenha.value;
        }

        fetch('api/usuario/atualizar_perfil.php', {
            method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPerfil)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                mostrarMensagem(perfilMessage, 'Perfil atualizado com sucesso!', 'sucesso');
                perfilSenhaAntiga.value = '';
                perfilNovaSenha.value = '';
                toggleEdicaoPerfil(false); 
            } else {
                mostrarMensagem(perfilMessage, 'Erro: ' + data.mensagem, 'erro');
            }
        })
        .catch(error => {
            mostrarMensagem(perfilMessage, 'Erro de conexão com a API.', 'erro');
        });
    });

    // --- Lógica do Modal de Avaliação (Fechar e Enviar) ---
    document.getElementById('modal-avaliacao-close').addEventListener('click', (e) => {
        e.preventDefault();
        modalAvaliacao.classList.remove('active');
    });

    document.getElementById('btn-enviar-avaliacao').addEventListener('click', () => {
        const reservaId = document.getElementById('avaliacao-reserva-id').value;
        const nota = document.getElementById('avaliacao-nota').value;
        const comentario = document.getElementById('avaliacao-comentario').value;
        const msgElement = document.getElementById('avaliacao-message');

        if (!nota) {
            msgElement.innerText = 'Por favor, selecione uma nota.';
            msgElement.style.backgroundColor = '#FFCDD2';
            msgElement.style.display = 'block';
            return;
        }

        fetch('api/avaliacao/criar.php', {
            method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reserva_id: reservaId,
                nota: nota,
                comentario: comentario
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                modalAvaliacao.classList.remove('active');
                mostrarAlerta('alerta-aval-sucesso', 'sucesso');
                carregarMinhasReservas(); 
            } else {
                msgElement.innerText = 'Erro: ' + data.mensagem;
                msgElement.style.backgroundColor = '#FFCDD2';
                msgElement.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erro ao enviar avaliação:', error);
            msgElement.innerText = 'Erro de conexão com a API.';
            msgElement.style.backgroundColor = '#FFCDD2';
            msgElement.style.display = 'block';
        });
    });

} // Fim do iniciarPagina()