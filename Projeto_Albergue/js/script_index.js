/*
 * Arquivo: js/script_index.js
 * Descrição: Lógica da página principal (index.html)
 */

// ========================================================================
// DICIONÁRIO DE IDIOMAS (RF10)
// ========================================================================
// (Aqui guardamos todos os textos "estáticos" da página)
const dicionarioTextos = {
    'pt': {
        // Menu
        'nav-inicio': 'Início',
        'nav-acomodacoes': 'Acomodações',
        'nav-beneficios': 'Benefícios',
        'nav-localizacao': 'Localização',
        'nav-avaliacoes': 'Avaliações',
        'btn-login': 'Login / Cadastro',
        'btn-minha-conta': 'Minha Conta',
        // Hero
        'hero-titulo': 'SANTA TERESA',
        'hero-subtitulo': 'Hospede-se no aconchegante bairro do RJ',
        'label-checkin': 'Check-in',
        'label-checkout': 'Check-out',
        'btn-buscar': 'Buscar',
        // Acomodações
        'acomodacoes-titulo': 'Temos o quarto ideal para você',
        'acomodacoes-subtitulo': 'Descubra o melhor lugar para se hospedar no Rio de Janeiro: Garden Hostel Santa Teresa!',
        'btn-reserve': 'Reserve Agora!',
        'quartos-carregando': 'Carregando quartos disponíveis...',
        'quartos-disponivel-de': 'Disponível de',
        'quartos-disponivel-ate': 'até',
        'quartos-indefinido': 'indefinido',
        'btn-confira': 'Confira!',
        // Benefícios
        'beneficios-titulo': 'Nossos benefícios',
        'beneficio1': 'Wi-Fi grátis',
        'beneficio2': 'Excelentes acomodações',
        'beneficio3': 'Ar condicionado',
        'beneficio4': 'Lounge',
        'beneficio5': 'Copa e churrasqueira',
        'beneficios-texto': 'O Garden Hostel oferece ambientes confortáveis e funcionais, com lounge, área de coworking, estacionamento, churrasqueira, banheiros equipados e muito mais.',
        // Localização
        'localizacao-titulo': 'Nossa Localização',
        'localizacao-texto': 'Estamos localizados na Rua Francisca de Andrade, em Santa Teresa — um dos bairros mais charmosos e culturais do Rio de Janeiro.',
        // Avaliações
        'avaliacoes-titulo': 'O que dizem nossos hóspedes',
        // Rodapé
        'footer-copyright': '© 2025 Garden Hostel. Todos os direitos reservados.',
        'footer-endereco': 'Rua Francisca de Andrade, 123 - Rio de Janeiro, RJ'
    },
    'en': {
        // Menu
        'nav-inicio': 'Home',
        'nav-acomodacoes': 'Accommodations',
        'nav-beneficios': 'Amenities',
        'nav-localizacao': 'Location',
        'nav-avaliacoes': 'Reviews',
        'btn-login': 'Login / Sign Up',
        'btn-minha-conta': 'My Account',
        // Hero
        'hero-titulo': 'SANTA TERESA',
        'hero-subtitulo': 'Stay in the cozy neighborhood of Rio',
        'label-checkin': 'Check-in',
        'label-checkout': 'Check-out',
        'btn-buscar': 'Search',
        // Acomodações
        'acomodacoes-titulo': 'We have the ideal room for you',
        'acomodacoes-subtitulo': 'Discover the best place to stay in Rio de Janeiro: Garden Hostel Santa Teresa!',
        'btn-reserve': 'Book Now!',
        'quartos-carregando': 'Loading available rooms...',
        'quartos-disponivel-de': 'Available from',
        'quartos-disponivel-ate': 'until',
        'quartos-indefinido': 'indefinite',
        'btn-confira': 'Check it out!',
        // Benefícios
        'beneficios-titulo': 'Our Amenities',
        'beneficio1': 'Free Wi-Fi',
        'beneficio2': 'Excellent accommodations',
        'beneficio3': 'Air conditioning',
        'beneficio4': 'Lounge',
        'beneficio5': 'Kitchen & BBQ',
        'beneficios-texto': 'Garden Hostel offers comfortable and functional environments, with a lounge, coworking area, parking, BBQ, equipped bathrooms, and much more.',
        // Localização
        'localizacao-titulo': 'Our Location',
        'localizacao-texto': 'We are located on Rua Francisca de Andrade, in Santa Teresa — one of the most charming and cultural neighborhoods in Rio de Janeiro.',
        // Avaliações
        'avaliacoes-titulo': 'What our guests say',
        // Rodapé
        'footer-copyright': '© 2025 Garden Hostel. All rights reserved.',
        'footer-endereco': 'Rua Francisca de Andrade, 123 - Rio de Janeiro, RJ'
    }
};

// ========================================================================
// SCRIPT PRINCIPAL
// ========================================================================

// Variável global pra guardar o idioma atual
// 1. Tenta "ler" a escolha salva na "caixa" do localStorage
let idiomaAtual = localStorage.getItem('idioma');

// 2. Se a "caixa" estiver vazia (primeira visita), usa 'pt' como padrão
if (!idiomaAtual) {
    idiomaAtual = 'pt';
}

// "Ouve" o evento de que a página HTML foi 100% carregada
document.addEventListener('DOMContentLoaded', () => {

    // 0. Verifica se o usuário está logado e atualiza o header
    fetch('api/usuario/checar_sessao.php', { method: 'GET', credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.logado && data.tipo_usuario === 'CLIENTE') {
                const userInfo = document.getElementById('header-user-info');
                userInfo.style.display = 'flex';
                userInfo.style.alignItems = 'center';
                userInfo.style.gap = '10px';
                document.getElementById('header-login-buttons').style.display = 'none';
                document.getElementById('header-user-name').innerText = `Olá, ${data.nome}`;
            } else {
                document.getElementById('header-user-info').style.display = 'none';
                document.getElementById('header-login-buttons').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar sessão:', error);
        });

    // 3. Aplica a tradução IMEDIATAMENTE quando a página carrega
    aplicarTraducoes();

    // 4. Atualiza o botão da bandeira ATIVA
    if (idiomaAtual === 'en') {
        document.getElementById('btn-lang-en').classList.add('active');
        document.getElementById('btn-lang-pt').classList.remove('active');
    } else {
        document.getElementById('btn-lang-pt').classList.add('active');
        document.getElementById('btn-lang-en').classList.remove('active');
    }
    
    // --- Seção 1: Lógica da Barra de Busca ---
    const btnBuscar = document.getElementById('btn-buscar');
    const inputCheckin = document.getElementById('checkin');
    const inputCheckout = document.getElementById('checkout');

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const checkinVal = inputCheckin.value;
            const checkoutVal = inputCheckout.value;

            if (!checkinVal || !checkoutVal) {
                alert('Por favor, preencha as datas de Chegada e Partida.');
                return;
            }
            if (checkoutVal <= checkinVal) {
                alert('A data de Partida deve ser depois da data de Chegada.');
                return;
            }
            window.location.href = `reserva.html?checkin=${checkinVal}&checkout=${checkoutVal}`;
        });
    }

    // --- Seção 1.5: Lógica dos Cards de Quartos (Clicar na imagem para reservar) ---
    const cardsQuartos = document.querySelectorAll('.acomodacao-card');
    cardsQuartos.forEach(card => {
        const img = card.querySelector('.card-img');
        const btnConfira = card.querySelector('.btn-card');
        
        // Função para iniciar reserva
        const iniciarReserva = () => {
            // Verifica se o usuário está logado
            fetch('api/usuario/checar_sessao.php', { method: 'GET', credentials: 'include' })
                .then(response => response.json())
                .then(data => {
                    if (data.logado && data.tipo_usuario === 'CLIENTE') {
                        // Usuário logado - vai para a página de reserva
                        const checkinVal = inputCheckin.value;
                        const checkoutVal = inputCheckout.value;
                        
                        if (!checkinVal || !checkoutVal) {
                            alert('Por favor, preencha as datas de Check-in e Check-out antes de reservar.');
                            // Foca no formulário de busca
                            inputCheckin.focus();
                            return;
                        }
                        if (checkoutVal <= checkinVal) {
                            alert('A data de Check-out deve ser depois da data de Check-in.');
                            return;
                        }
                        window.location.href = `reserva.html?checkin=${checkinVal}&checkout=${checkoutVal}`;
                    } else {
                        // Usuário não logado - redireciona para login
                        alert('Por favor, faça login para fazer uma reserva.');
                        window.location.href = 'login.html';
                    }
                })
                .catch(error => {
                    console.error('Erro ao verificar sessão:', error);
                    alert('Por favor, faça login para fazer uma reserva.');
                    window.location.href = 'login.html';
                });
        };
        
        // Adiciona evento de clique na imagem
        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', iniciarReserva);
        }
        
        // Adiciona evento de clique no botão "Confira!"
        if (btnConfira) {
            btnConfira.addEventListener('click', (e) => {
                e.preventDefault();
                iniciarReserva();
            });
        }
    });

    // --- Seção 2: Lógica para "Clicar em qualquer lugar" (Seletor de Data) ---
    const camposDeData = document.querySelectorAll('.search-field');

    camposDeData.forEach(campo => {
        campo.addEventListener('click', () => {
            const input = campo.querySelector('input[type="date"]');
            if (input) {
                try {
                    input.showPicker();
                } catch (error) {
                    input.focus();
                }
            }
        });
    });

    // --- Seção 3: Lógica para carregar Quartos Disponíveis ---
    carregarQuartosDisponiveis();

    // --- Seção 4: Lógica para carregar Avaliações (RF07) ---
    // (A lógica do carrossel está dentro desta função)
    carregarAvaliacoes(); 


    // --- Seção 5: Lógica da Galeria (Popup) "Nossos Benefícios" ---
    const imagensGaleria = document.querySelectorAll('.beneficio-img');
    const modal = document.getElementById('modal-galeria');
    const modalImg = document.getElementById('modal-imagem');
    const btnClose = document.getElementById('modal-close');
    const btnPrev = document.getElementById('modal-prev');
    const btnNext = document.getElementById('modal-next');
    
    if (modal && modalImg && btnClose && btnPrev && btnNext) {
    
        let indiceAtual = 0; 

        function abrirModal(index) {
            indiceAtual = index; 
            modalImg.src = imagensGaleria[indiceAtual].src; 
            modal.classList.add('active'); 
        }

        function fecharModal() {
            modal.classList.remove('active'); 
        }

        function proximaImagem() {
            indiceAtual++; 
            if (indiceAtual >= imagensGaleria.length) {
                indiceAtual = 0; 
            }
            modalImg.src = imagensGaleria[indiceAtual].src;
        }

        function imagemAnterior() {
            indiceAtual--; 
            if (indiceAtual < 0) {
                indiceAtual = imagensGaleria.length - 1; 
            }
            modalImg.src = imagensGaleria[indiceAtual].src;
        }

        imagensGaleria.forEach((img, index) => {
            img.addEventListener('click', () => {
                abrirModal(index);
            });
        });

        btnClose.addEventListener('click', fecharModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target == modal) {
                fecharModal();
            }
        });

        btnNext.addEventListener('click', proximaImagem);
        btnPrev.addEventListener('click', imagemAnterior);
    
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('active')) {
                if (e.key === 'Escape' || e.key === 'Esc') {
                    fecharModal();
                }
                if (e.key === 'ArrowRight') {
                    proximaImagem();
                }
                if (e.key === 'ArrowLeft') {
                    imagemAnterior();
                }
            }
        });
    
    } // Fim do 'if (modal && ...)'

    // --- Seção 6: "Scroll Spy" (Marca o menu ao rolar) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    const observerOptions = {
        root: null, 
        rootMargin: "-80px 0px -40% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.main-nav a[href="#${id}"]`);

                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    
    // --- SEÇÃO 7: LÓGICA DE TRADUÇÃO (APENAS OS BOTÕES) ---
    const btnPt = document.getElementById('btn-lang-pt');
    const btnEn = document.getElementById('btn-lang-en');
    
    btnPt.addEventListener('click', () => {
        idiomaAtual = 'pt';
        localStorage.setItem('idioma', 'pt'); // Salva a escolha
        btnPt.classList.add('active');
        btnEn.classList.remove('active');
        aplicarTraducoes();
    });
    
    btnEn.addEventListener('click', () => {
        idiomaAtual = 'en';
        localStorage.setItem('idioma', 'en'); // Salva a escolha
        btnEn.classList.add('active');
        btnPt.classList.remove('active');
        aplicarTraducoes();
    });
    
}); // Fim do 'DOMContentLoaded'

// ========================================================================
// FUNÇÕES GLOBAIS
// ========================================================================

/**
 * Função: aplicarTraducoes
 * Descrição: Varre o dicionário e troca os textos estáticos da página
 */
function aplicarTraducoes() {
    // Pega todos os elementos que têm um 'data-key'
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (dicionarioTextos[idiomaAtual][key]) {
            elem.innerText = dicionarioTextos[idiomaAtual][key];
        }
    });
    
    // Recarrega os quartos disponíveis e avaliações (que vêm do BD)
    carregarQuartosDisponiveis();
    carregarAvaliacoes();

    // Sinaliza para o CSS que a tradução terminou e
    // que os textos podem ser exibidos.
    document.body.classList.add('js-traduzido');
}

/**
 * Função: carregarQuartosDisponiveis
 * Descrição: Carrega os quartos disponíveis do banco e exibe na página inicial
 */
function carregarQuartosDisponiveis() {
    const container = document.getElementById('quartos-disponiveis-grid');
    container.innerHTML = `<p>${dicionarioTextos[idiomaAtual]['quartos-carregando']}</p>`;

    fetch('api/quartos/listar_disponiveis.php')
        .then(response => response.json())
        .then(quartos => {
            container.innerHTML = '';

            if (quartos.length === 0) {
                container.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum quarto disponível no momento.</p>';
                return;
            }

            quartos.forEach(quarto => {
                // Determina a imagem baseada na capacidade
                let imagem = 'imagens/quarto-4-camas.jpg'; // Padrão
                if (quarto.capacidade >= 12) {
                    imagem = 'imagens/quarto-12-camas.jpg';
                } else if (quarto.capacidade >= 8) {
                    imagem = 'imagens/quarto-8-camas.jpg';
                } else if (quarto.capacidade >= 4) {
                    imagem = 'imagens/quarto-4-camas.jpg';
                }

                // Formata as datas
                const dataEntrada = quarto.data_entrada ? new Date(quarto.data_entrada).toLocaleDateString('pt-BR') : 'Hoje';
                const dataSaida = quarto.data_saida ? new Date(quarto.data_saida).toLocaleDateString('pt-BR') : dicionarioTextos[idiomaAtual]['quartos-indefinido'];
                
                // Pega a descrição no idioma correto
                const descricao = (idiomaAtual === 'en' && quarto.descricao_en) ? quarto.descricao_en : (quarto.descricao_pt || 'Quarto confortável e bem equipado.');

                const card = document.createElement('article');
                card.className = 'acomodacao-card';
                card.innerHTML = `
                    <img src="${imagem}" alt="${quarto.nome}" class="card-img">
                    <div class="card-content">
                        <h3>${quarto.nome}</h3>
                        <p>${descricao}</p>
                        <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
                            <strong>${dicionarioTextos[idiomaAtual]['quartos-disponivel-de']}</strong> ${dataEntrada} 
                            <strong>${dicionarioTextos[idiomaAtual]['quartos-disponivel-ate']}</strong> ${dataSaida}
                        </p>
                        <p style="font-size: 0.9em; color: #666;">
                            <strong>Capacidade:</strong> ${quarto.capacidade} camas | 
                            <strong>Preço:</strong> R$ ${quarto.preco_diaria}/diária
                        </p>
                        <a href="#form-busca" class="btn btn-card" data-key="btn-confira">${dicionarioTextos[idiomaAtual]['btn-confira']}</a>
                    </div>
                `;
                container.appendChild(card);

                // Adiciona evento de clique na imagem e botão
                const img = card.querySelector('.card-img');
                const btnConfira = card.querySelector('.btn-card');
                
                const iniciarReserva = () => {
                    const inputCheckinEl = document.getElementById('checkin');
                    const inputCheckoutEl = document.getElementById('checkout');
                    
                    fetch('api/usuario/checar_sessao.php', { method: 'GET', credentials: 'include' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.logado && data.tipo_usuario === 'CLIENTE') {
                                const checkinVal = inputCheckinEl ? inputCheckinEl.value : '';
                                const checkoutVal = inputCheckoutEl ? inputCheckoutEl.value : '';
                                
                                if (!checkinVal || !checkoutVal) {
                                    alert('Por favor, preencha as datas de Check-in e Check-out antes de reservar.');
                                    if (inputCheckinEl) inputCheckinEl.focus();
                                    return;
                                }
                                if (checkoutVal <= checkinVal) {
                                    alert('A data de Check-out deve ser depois da data de Check-in.');
                                    return;
                                }
                                window.location.href = `reserva.html?checkin=${checkinVal}&checkout=${checkoutVal}`;
                            } else {
                                alert('Por favor, faça login para fazer uma reserva.');
                                window.location.href = 'login.html';
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao verificar sessão:', error);
                            alert('Por favor, faça login para fazer uma reserva.');
                            window.location.href = 'login.html';
                        });
                };
                
                if (img) {
                    img.style.cursor = 'pointer';
                    img.addEventListener('click', iniciarReserva);
                }
                if (btnConfira) {
                    btnConfira.addEventListener('click', (e) => {
                        e.preventDefault();
                        iniciarReserva();
                    });
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar quartos:', error);
            container.innerHTML = '<p style="text-align: center; width: 100%;">Erro ao carregar quartos disponíveis.</p>';
        });
}

/**
 * Função: carregarAvaliacoes
 * (MODIFICADA para suportar idiomas)
 */
function carregarAvaliacoes() {
    const container = document.getElementById('avaliacoes-container');
    container.innerHTML = '<p style="color: #fff; text-align: center; width: 100%;">Carregando avaliações...</p>';

    fetch('api/avaliacao/listar_publicas.php')
        .then(response => response.json())
        .then(avaliacoes => { 
            
            container.innerHTML = ''; 

            if (avaliacoes.length === 0) {
                container.innerHTML = '<p style="color: #fff; text-align: center; width: 100%;">Ainda não há avaliações públicas.</p>';
                return; 
            }

            avaliacoes.forEach(avaliacao => {
                
                const cardHTML = `
                    <div class="avaliacao-card">
                        <p>"${avaliacao.comentario}"</p> <strong>- ${avaliacao.cliente_nome} (Nota: ${avaliacao.nota}/5)</strong>
                    </div>
                `;
                container.innerHTML += cardHTML;
            });

            // --- LÓGICA DO CARROSSEL ---
            const prevBtn = document.getElementById('review-prev');
            const nextBtn = document.getElementById('review-next');
            const scroller = container;
            
            if (!prevBtn || !nextBtn) return;
            
            let autoScrollInterval;

            function scrollNext() {
                if (scroller.children.length === 0) return;
                const cardWidth = scroller.querySelector('.avaliacao-card').offsetWidth + 30;

                if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 10) {
                    scroller.scrollLeft = 0; 
                } else {
                    scroller.scrollLeft += cardWidth; 
                }
            }

            function scrollPrev() {
                if (scroller.children.length === 0) return;
                const cardWidth = scroller.querySelector('.avaliacao-card').offsetWidth + 30;
                
                if (scroller.scrollLeft === 0) {
                     scroller.scrollLeft = scroller.scrollWidth; 
                } else {
                    scroller.scrollLeft -= cardWidth; 
                }
            }

            function startAutoScroll() {
                // (Reinicia o timer apenas se não houver um ativo)
                if (autoScrollInterval) clearInterval(autoScrollInterval);
                autoScrollInterval = setInterval(scrollNext, 5000);
            }
            function stopAutoScroll() {
                clearInterval(autoScrollInterval);
            }

            nextBtn.addEventListener('click', () => {
                stopAutoScroll();
                scrollNext();
                startAutoScroll();
            });

            prevBtn.addEventListener('click', () => {
                stopAutoScroll();
                scrollPrev();
                startAutoScroll();
            });

            startAutoScroll();

        }) 
        .catch(error => {
            console.error('Erro ao carregar avaliações:', error);
            container.innerHTML = '<p style="color: #ffc; text-align: center; width: 100%;">Não foi possível carregar as avaliações no momento.</p>';
        });
}