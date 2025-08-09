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
















// Lógica para o sistema de avaliação por estrelas
document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.getElementById('doar-stars');

    if (starsContainer) {
        const stars = starsContainer.querySelectorAll('.doar-star');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.getAttribute('data-value'));

                stars.forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('filled');
                    } else {
                        s.classList.remove('filled');
                    }
                });
            });
        });
    }




    

  // --- LÓGICA PARA PRÉ-VISUALIZAÇÃO DA IMAGEM E DRAG-AND-DROP ---
    
    // Seleciona o input de arquivo e a div de upload
    const fileInput = document.getElementById('imagem');
    const imageUploadDiv = document.querySelector('.doar-image-upload');
    
    // Seleciona o ícone da câmera, texto e formulário para escondê-los
    const cameraIcon = imageUploadDiv.querySelector('.doar-camera-icon');
    const uploadText = imageUploadDiv.querySelector('p');
    const uploadForm = imageUploadDiv.querySelector('form');

    // Função centralizada para lidar com a pré-visualização da imagem
    function handleImagePreview(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageUploadDiv.style.backgroundImage = `url(${e.target.result})`;
                imageUploadDiv.style.backgroundSize = 'cover';
                imageUploadDiv.style.backgroundPosition = 'center';
                
                // Esconde os elementos de placeholder
                if (cameraIcon) cameraIcon.style.display = 'none';
                if (uploadText) uploadText.style.display = 'none';
                if (uploadForm) uploadForm.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            // Se nenhum arquivo foi selecionado, restaura os elementos de placeholder
            imageUploadDiv.style.backgroundImage = 'none';
            imageUploadDiv.style.backgroundColor = '#cfcfcf';
            if (cameraIcon) cameraIcon.style.display = 'block';
            if (uploadText) uploadText.style.display = 'block';
            if (uploadForm) uploadForm.style.display = 'block';
        }
    }

    if (fileInput && imageUploadDiv) {
        // Adiciona um evento de 'change' ao input de arquivo (quando clicado)
        fileInput.addEventListener('change', function() {
            handleImagePreview(this.files[0]);
        });
        
        // Adiciona um evento de 'click' na div para abrir a janela de seleção de arquivo
        imageUploadDiv.addEventListener('click', function() {
            fileInput.click();
        });

        // --- Eventos de Drag and Drop (NOVOS) ---
        
        // Impede o comportamento padrão do navegador e adiciona classe visual
        imageUploadDiv.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            imageUploadDiv.classList.add('dragover');
        });

        // Remove a classe visual quando o arquivo é arrastado para fora
        imageUploadDiv.addEventListener('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            imageUploadDiv.classList.remove('dragover');
        });

        // Captura o arquivo quando ele é solto
        imageUploadDiv.addEventListener('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            imageUploadDiv.classList.remove('dragover');

            const files = event.dataTransfer.files;
            if (files && files.length > 0) {
                // Chama a função de pré-visualização com o arquivo solto
                handleImagePreview(files[0]);

                // Opcional: Atribui o arquivo solto ao input de arquivo para que ele seja enviado com o formulário
                // A FileList é somente leitura, então a atribuição direta é complexa.
                // A pré-visualização visual já é o que o usuário geralmente espera.
            }
        });
    }
});