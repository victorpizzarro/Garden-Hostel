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
        'card1-titulo': 'Dormitório Misto com 4 Camas',
        'card1-texto': 'Quarto com ar-condicionado, cortinas individuais, armário com cadeado e banheiro privativo.',
        'btn-confira': 'Confira!',
        'card2-titulo': 'Dormitório Misto com 8 Camas',
        'card2-texto': 'Ambiente confortável e climatizado, com camas de casal tipo beliche e armário individual.',
        'card3-titulo': 'Dormitório Misto com 12 Camas',
        'card3-texto': 'Espaço amplo e climatizado, ideal para grupos, com tomadas, iluminação e cortinas individuais.',
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
        'card1-titulo': 'Mixed Dorm (4 Beds)',
        'card1-texto': 'Room with air conditioning, individual curtains, locker with padlock, and private bathroom.',
        'btn-confira': 'Check it out!',
        'card2-titulo': 'Mixed Dorm (8 Beds)',
        'card2-texto': 'Comfortable, air-conditioned environment, with double bunk beds and individual lockers.',
        'card3-titulo': 'Mixed Dorm (12 Beds)',
        'card3-texto': 'Spacious, air-conditioned area, ideal for groups, with power outlets, lighting, and individual curtains.',
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

    // --- Seção 3: Lógica para carregar Avaliações (RF07) ---
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
    
    // Recarrega as avaliações (que vêm do BD)
    // para pegar o 'comentario_pt' ou 'comentario_en'
    carregarAvaliacoes();

    // Sinaliza para o CSS que a tradução terminou e
    // que os textos podem ser exibidos.
    document.body.classList.add('js-traduzido');
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