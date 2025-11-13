/*
 * Arquivo: js/script_index.js
 * Descrição: Lógica da página principal (index.html)
 */

document.addEventListener('DOMContentLoaded', () => {
    
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
    carregarAvaliacoes(); // (A lógica do carrossel está dentro desta função)


    // --- Seção 5: Lógica da Galeria (Popup) "Nossos Benefícios" ---
    
    // 1. Pega todos os elementos do modal
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

        // 6. Liga os "ouvintes" (Event Listeners)
        
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
    
        // --- 7. NOVO: Liga o "ouvinte" do Teclado (Esc, Setas) ---
        document.addEventListener('keydown', (e) => {
            // Primeiro, checa se o modal está visível
            if (modal.classList.contains('active')) {
                
                // Se apertou 'Escape', fecha o modal
                if (e.key === 'Escape' || e.key === 'Esc') {
                    fecharModal();
                }

                // Se apertou 'Seta para Direita', vai para a próxima
                if (e.key === 'ArrowRight') {
                    proximaImagem();
                }

                // Se apertou 'Seta para Esquerda', vai para a anterior
                if (e.key === 'ArrowLeft') {
                    imagemAnterior();
                }
            }
        });
    
    } // Fim do 'if (modal && ...)'

    // --- SEÇÃO 6: Navegação suave + Scroll Spy ---
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');

    // 🔹 Navegação suave (sem precisar de href="#...")
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const sectionId = link.getAttribute('data-section') || link.getAttribute('href')?.replace('#', '');
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset + 1;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 🔹 Scroll Spy
    const observerOptions = {
        root: null,
        threshold: 0.3,
        rootMargin: "-70px 0px 0px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const linkSection = link.getAttribute('data-section') || link.getAttribute('href')?.replace('#', '');
                    link.classList.toggle('active', linkSection === id);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 🔹 Marca última seção quando chega ao fim da página
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            navLinks.forEach(link => link.classList.remove('active'));
            const lastLink = navLinks[navLinks.length - 1];
            if (lastLink) lastLink.classList.add('active');
        }
    });

}); // Fim do 'DOMContentLoaded'


/**
 * Função: carregarAvaliacoes
 * (Esta função permanece 100% igual)
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
                        <p>"${avaliacao.comentario}"</p>
                        <strong>- ${avaliacao.cliente_nome} (Nota: ${avaliacao.nota}/5)</strong>
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