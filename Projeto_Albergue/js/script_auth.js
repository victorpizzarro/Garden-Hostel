/**
 * Arquivo: /js/script_auth.js
 * Descrição: Lógica da página de Login e Cadastro (login.html)
 * (Versão 7.0 - Com tradução de erros da API no Frontend)
 */

// ========================================================================
// DICIONÁRIO DE IDIOMAS (RF10) - Página de Login
// ========================================================================
const dicionarioTextos = {
    'pt': {
        'login-titulo': 'Acessar minha conta',
        'login-email': 'Email',
        'login-senha': 'Senha',
        'login-btn-entrar': 'Entrar',
        'login-nao-tem-conta': 'Ainda não tem conta?',
        'login-cadastre': 'Cadastre-se aqui',
        'reg-titulo': 'Criar nova conta (RF08)',
        'reg-nome': 'Nome Completo',
        'reg-email': 'Email',
        'reg-senha': 'Senha',
        'reg-doc-tipo': 'Tipo de Documento',
        'reg-doc-num': 'Número do Documento',
        'reg-nascimento': 'Data de Nascimento',
        'reg-celular': 'Celular (com DDD)',
        'reg-btn-criar': 'Criar Conta',
        'reg-ja-tem-conta': 'Já tem uma conta?',
        'reg-faca-login': 'Faça o login aqui'
    },
    'en': {
        'login-titulo': 'Access my account',
        'login-email': 'Email',
        'login-senha': 'Password',
        'login-btn-entrar': 'Login',
        'login-nao-tem-conta': "Don't have an account?",
        'login-cadastre': 'Register here',
        'reg-titulo': 'Create new account (RF08)',
        'reg-nome': 'Full Name',
        'reg-email': 'Email',
        'reg-senha': 'Password',
        'reg-doc-tipo': 'Document Type',
        'reg-doc-num': 'Document Number',
        'reg-nascimento': 'Date of Birth',
        'reg-celular': 'Phone (with area code)',
        'reg-btn-criar': 'Create Account',
        'reg-ja-tem-conta': 'Already have an account?',
        'reg-faca-login': 'Login here'
    }
};

// ========================================================================
// NOVO: DICIONÁRIO PARA TRADUZIR ERROS DA API
// ========================================================================
const dicionarioErros = {
    'ERRO_EMAIL_DUPLICADO': {
        'pt': 'Este email já está cadastrado.',
        'en': 'This email is already registered.'
    },
    'ERRO_DOC_DUPLICADO': {
        'pt': 'Este número de documento já está cadastrado.',
        'en': 'This document number is already registered.'
    },
    'ERRO_GENERICO_CADASTRO': {
        'pt': 'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
        'en': 'An error occurred while creating the account. Please try again.'
    },
    'ERRO_CONEXAO': {
        'pt': 'Erro de conexão com a API.',
        'en': 'API connection error.'
    }
};

// ========================================================================
// SCRIPT PRINCIPAL
// ========================================================================

let idiomaAtual = localStorage.getItem('idioma') || 'pt';

/**
 * Função: aplicarTraducoes (Global)
 */
function aplicarTraducoes() {
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (dicionarioTextos[idiomaAtual] && dicionarioTextos[idiomaAtual][key]) {
            elem.innerText = dicionarioTextos[idiomaAtual][key];
        }
    });
    document.body.classList.add('js-traduzido');
}

// ========================================================================
// (CORREÇÃO) FUNÇÕES GLOBAIS DE AJUDA PARA VALIDAÇÃO
// (Movidas para fora do DOMContentLoaded para corrigir o ReferenceError)
// ========================================================================

function mostrarErro(inputId, mensagem) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.classList.add('input-error');
    }
    const errorDiv = document.getElementById(inputId + '-error');
    if (errorDiv) { 
        errorDiv.innerText = mensagem;
        errorDiv.style.display = 'block';
    } else if (inputId === 'register-error-message' || inputId === 'login-error-message') {
        const globalErrorDiv = document.getElementById(inputId);
        globalErrorDiv.innerText = mensagem;
        globalErrorDiv.style.display = 'block';
    }
}
function limparErro(inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.classList.remove('input-error');
    }
    const errorDiv = document.getElementById(inputId + '-error');
    if (errorDiv) {
        errorDiv.innerText = '';
        errorDiv.style.display = 'none';
    }
}
function limparErroGeral(elemento) {
    if (elemento) {
        elemento.innerText = '';
        elemento.style.display = 'none';
    }
}

// ========================================================================
// INÍCIO DO DOMContentLoaded
// ========================================================================

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
        idiomaAtual = 'pt';
        localStorage.setItem('idioma', 'pt');
        btnPt.classList.add('active');
        btnEn.classList.remove('active');
        aplicarTraducoes();
    });
    btnEn.addEventListener('click', () => {
        idiomaAtual = 'en';
        localStorage.setItem('idioma', 'en');
        btnEn.classList.add('active');
        btnPt.classList.remove('active');
        aplicarTraducoes();
    });

    // --- 2. Seletores dos Formulários ---
    const loginWrapper = document.getElementById('form-login-wrapper');
    const registerWrapper = document.getElementById('form-register-wrapper');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    const formLogin = document.getElementById('form-login'); // (Para o .reset())
    const formRegister = document.getElementById('form-register'); // (Para o .reset())

    const btnLogin = document.getElementById('btn-login-submit');
    const loginErrorMessage = document.getElementById('login-error-message');
    const btnRegister = document.getElementById('btn-register-submit');
    const registerErrorMessage = document.getElementById('register-error-message');
    
    const regNome = document.getElementById('reg-nome');
    const regEmail = document.getElementById('reg-email');
    const regSenha = document.getElementById('reg-senha');
    const regDocTipo = document.getElementById('reg-doc-tipo');
    const regDocNum = document.getElementById('reg-doc-num');
    const regNascimento = document.getElementById('reg-nascimento');
    const regCelular = document.getElementById('reg-celular');

    // --- 3. Lógica de Troca de Formulário ---
    showRegisterLink.addEventListener('click', (e) => { 
        e.preventDefault(); 
        loginWrapper.classList.add('hidden'); 
        registerWrapper.classList.remove('hidden'); 
        formLogin.reset(); // Limpa o form de login
        limparErroGeral(loginErrorMessage);
    });
    showLoginLink.addEventListener('click', (e) => { 
        e.preventDefault(); 
        registerWrapper.classList.add('hidden'); 
        loginWrapper.classList.remove('hidden');

        // Limpa o formulário de cadastro ao voltar
        formRegister.reset();
        limparErroGeral(registerErrorMessage);
        limparErro('reg-nome');
        limparErro('reg-email');
        limparErro('reg-senha');
        limparErro('reg-doc-num');
        limparErro('reg-nascimento');
        limparErro('reg-celular');
    });

    // --- 4. Lógica de Login ---
    btnLogin.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        if (!email || !senha) {
            mostrarErro('login-error-message', 'Email e senha são obrigatórios.'); return;
        }
        fetch('api/usuario/login.php', {
            method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'sucesso') {
                const reservaPendente = localStorage.getItem('reservaPendente');
                if (data.tipo_usuario === 'CLIENTE' && reservaPendente) {
                    window.location.href = 'reserva.html';
                } else if (data.tipo_usuario === 'CLIENTE') {
                    window.location.href = 'painel_cliente.html';
                } else {
                    window.location.href = 'painel_admin.html';
                }
            } else {
                mostrarErro('login-error-message', data.mensagem);
            }
        })
        .catch(err => mostrarErro('login-error-message', 'Erro de conexão.'));
    });
    
    // --- 5. Funções de Ajuda para Validação ---
    // (AS FUNÇÕES FORAM MOVIDAS PARA O TOPO DO ARQUIVO)

    // --- 6. Lógica de MÁSCARA (enquanto digita) ---
    regDocNum.addEventListener('input', (e) => {
        if (regDocTipo.value !== 'CPF') return; 
        let valor = e.target.value.replace(/\D/g, ''); valor = valor.substring(0, 11); 
        let valorFormatado = '';
        if (valor.length > 9) { valorFormatado = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        } else if (valor.length > 6) { valorFormatado = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (valor.length > 3) { valorFormatado = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        } else { valorFormatado = valor; }
        e.target.value = valorFormatado; 
    });
    regCelular.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, ''); valor = valor.substring(0, 11); 
        let valorFormatado = '';
        if (valor.length === 11) { valorFormatado = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (valor.length > 6) { valorFormatado = valor.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
        } else if (valor.length > 2) { valorFormatado = valor.replace(/(\d{2})(\d{1,4})/, '($1) $2');
        } else if (valor.length > 0) { valorFormatado = valor.replace(/(\d{1,2})/, '($1'); }
        e.target.value = valorFormatado; 
    });

    // --- 7. Lógica de VALIDAÇÃO (ao sair do campo - "on-blur") ---
    regNome.addEventListener('blur', () => { const nomeCompleto = regNome.value.trim().split(' '); if (!regNome.value.trim()) { mostrarErro('reg-nome', 'Preencha este campo.'); } else if (nomeCompleto.length < 2 || nomeCompleto[0].length < 3) { mostrarErro('reg-nome', 'Nome e sobrenome obrigatórios (mín. 3 letras no nome).'); } else { limparErro('reg-nome'); } });
    regEmail.addEventListener('blur', () => { const emailRegex = /\S+@\S+\.\S+/; if (!regEmail.value.trim()) { mostrarErro('reg-email', 'Preencha este campo.'); } else if (!emailRegex.test(regEmail.value)) { mostrarErro('reg-email', 'Formato de email inválido.'); } else { limparErro('reg-email'); } });
    regDocNum.addEventListener('blur', () => { const valor = regDocNum.value; if (!valor.trim()) { mostrarErro('reg-doc-num', 'Preencha este campo.'); } else if (regDocTipo.value === 'CPF' && valor.length !== 14) { mostrarErro('reg-doc-num', 'CPF inválido (deve ter 11 dígitos).'); } else { limparErro('reg-doc-num'); } });
    regNascimento.addEventListener('blur', () => { if (!regNascimento.value) { mostrarErro('reg-nascimento', 'Preencha este campo.'); } else { const ano = new Date(regNascimento.value).getFullYear(); if (isNaN(ano) || ano < 1900 || ano > new Date().getFullYear()) { mostrarErro('reg-nascimento', 'Data inválida (ano deve ter 4 dígitos e ser válido).'); } else { limparErro('reg-nascimento'); } } });
    regCelular.addEventListener('blur', () => { const valor = regCelular.value; if (!valor.trim()) { mostrarErro('reg-celular', 'Preencha este campo.'); } else if (valor.length < 14) { mostrarErro('reg-celular', 'Celular incompleto.'); } else { limparErro('reg-celular'); } });
    
    // --- 8. Lógica para Abrir Calendário e Bloquear Digitação ---
    const dataFieldWrapper = regNascimento.parentElement;
    dataFieldWrapper.addEventListener('click', (e) => { try { regNascimento.showPicker(); } catch (error) { regNascimento.focus(); } });
    regNascimento.addEventListener('keydown', (e) => { if (e.key !== 'Tab') { e.preventDefault(); } });
    
    // --- 9. Lógica para Limpar Erros "ao digitar" ---
    regNome.addEventListener('input', () => limparErro('reg-nome'));
    regEmail.addEventListener('input', () => limparErro('reg-email'));
    regDocNum.addEventListener('input', () => limparErro('reg-doc-num'));
    regNascimento.addEventListener('input', () => limparErro('reg-nascimento'));
    regCelular.addEventListener('input', () => limparErro('reg-celular'));
    regSenha.addEventListener('input', () => {
        limparErro('reg-senha');
        limparErroGeral(registerErrorMessage);
    });

    // --- 10. Lógica do Botão "Criar Conta" (Verificação Final) ---
    btnRegister.addEventListener('click', () => {
        
        limparErroGeral(registerErrorMessage);

        // Força todas as validações
        regNome.dispatchEvent(new Event('blur'));
        regEmail.dispatchEvent(new Event('blur'));
        regDocNum.dispatchEvent(new Event('blur'));
        regNascimento.dispatchEvent(new Event('blur'));
        regCelular.dispatchEvent(new Event('blur'));

        if (!regSenha.value) {
            mostrarErro('reg-senha', 'Preencha este campo.');
        } else {
            limparErro('reg-senha');
        }

        if (document.querySelector('.field-error[style*="display: block"]')) {
            mostrarErro('register-error-message', 'Por favor, corrija os campos em vermelho.');
            return;
        }

        const dadosCadastro = {
            nome_completo: regNome.value,
            email: regEmail.value,
            senha: regSenha.value,
            documento_tipo: regDocTipo.value,
            documento_numero: regDocNum.value.replace(/\D/g, ''),
            data_nascimento: regNascimento.value,
            telefone_celular: regCelular.value.replace(/\D/g, '')
        };
        
        fetch('api/usuario/cadastro.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCadastro)
        })
        .then(response => {
            if (!response.ok) { 
                return response.json().then(err => { throw new Error(err.mensagem); });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'sucesso') {
                alert('Conta criada com sucesso! Por favor, faça o login.');
                formRegister.reset(); 
                showLoginLink.click();
            }
        })
        .catch(error => {
            console.error('Erro no fetch de cadastro:', error);
            
            // --- LÓGICA DE TRADUÇÃO "CLIENT-SIDE" ---
            let erroKey = 'ERRO_GENERICO_CADASTRO'; // Padrão
            const rawMessage = error.message;

            if (rawMessage.includes('email')) { 
                erroKey = 'ERRO_EMAIL_DUPLICADO';
            } 
            else if (rawMessage.includes('documento_numero')) {
                erroKey = 'ERRO_DOC_DUPLICADO';
            }
            
            const mensagemAmigavel = dicionarioErros[idiomaAtual][erroKey];
            
            // Agora 'mostrarErro' é global e pode ser chamada
            mostrarErro('register-error-message', mensagemAmigavel);
        });
    });

}); // Fim do 'DOMContentLoaded'