// script.js

// --- Código do Botão Voltar ao Topo (mantenha o que você já tem) ---
const backToTopButton = document.getElementById('backToTopBtn');
if (backToTopButton) {
    backToTopButton.addEventListener('click', function() {
        scrollToTop(1500); 
    });
}

function scrollToTop(duration) {
    const start = window.pageYOffset; 
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime(); 
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    function animateScroll() {
        const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        const timeElapsed = currentTime - startTime;
        const newPosition = easeInOutQuad(timeElapsed, start, -start, duration); 
        window.scrollTo(0, newPosition); 
        if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll); 
        } else {
            window.scrollTo(0, 0); 
        }
    }
    animateScroll(); 
}











document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar um arquivo HTML e injetá-lo em um placeholder
    function loadHTML(url, elementId) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const targetElement = document.getElementById(elementId);
                if (targetElement) {
                    targetElement.innerHTML = html;

                    // --- Lógica específica após carregar o cabeçalho ---
                    if (elementId === 'header-placeholder') {
                        setupHeaderPopups(); // Configura a funcionalidade dos popups do cabeçalho
                    }
                    
                    // --- Lógica específica após carregar o rodapé ---
                    if (elementId === 'footer-placeholder') {
                        const backToTopBtnNew = document.getElementById('backToTopBtn');
                        if (backToTopBtnNew) {
                            backToTopBtnNew.addEventListener('click', function() {
                                scrollToTop(1500);
                            });
                        }
                    }
                }
            })
            .catch(error => console.error(`Erro ao carregar ${url}:`, error));
    }

    // --- FUNÇÃO PARA CONFIGURAR TODOS OS POPUPS DO CABEÇALHO ---
    function setupHeaderPopups() {
        // --- Lógica do Login Popup ---
        const loginInfo = document.getElementById('loginInfo');
        const loginPopup = document.getElementById('loginPopup');
        const loginForm = document.getElementById('loginForm');

        if (loginInfo && loginPopup) {
            loginInfo.addEventListener('click', function(event) {
                event.stopPropagation(); // Evita que o clique "borbulhe"
                loginPopup.style.display = loginPopup.style.display === 'block' ? 'none' : 'block';
                pointsPopup.style.display = 'none'; // Fecha o popup de pontos se o login abrir
            });

            if (loginForm) {
                loginForm.addEventListener('submit', function(event) {
                    event.preventDefault(); 
                    console.log('Formulário de login submetido!');
                    loginPopup.style.display = 'none';
                    loginForm.reset();
                });
            }
        }

        // --- Lógica do Popup de PONTUAÇÃO ---
        const pontuacaoNavLink = document.getElementById('pontuacaoNavLink');
        const pointsPopup = document.getElementById('pointsPopup');

        if (pontuacaoNavLink && pointsPopup) {
            pontuacaoNavLink.addEventListener('click', function(event) {
                event.preventDefault(); // Impede o link de âncora
                event.stopPropagation(); // Impede que o clique "borbulhe"
                pointsPopup.style.display = pointsPopup.style.display === 'block' ? 'none' : 'block';
                loginPopup.style.display = 'none'; // Fecha o popup de login se o de pontos abrir
            });
        }

        // --- Lógica Comum para Fechar Popups ao Clicar Fora ---
        document.addEventListener('click', function(event) {
            // Se o popup de login estiver visível E o clique não foi no loginInfo NEM no popup de login
            if (loginPopup && loginPopup.style.display === 'block' && 
                !loginInfo.contains(event.target) && 
                !loginPopup.contains(event.target)) {
                loginPopup.style.display = 'none';
            }
            // Se o popup de pontos estiver visível E o clique não foi no pontuacaoNavLink NEM no popup de pontos
            // Note: pontuacaoNavLink.contains(event.target) verifica se o clique foi no próprio link OU em um de seus filhos (o popup).
            if (pointsPopup && pointsPopup.style.display === 'block' &&
                !pontuacaoNavLink.contains(event.target) && // Verifica se o clique foi *fora* do item de navegação principal (que inclui o popup)
                !pointsPopup.contains(event.target)) { // E se não foi *dentro* do popup (para cliques internos)
                pointsPopup.style.display = 'none';
            }
        });
    }

    // Carrega o cabeçalho e o rodapé
    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder');
});