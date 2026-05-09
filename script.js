// script.js - Arquivo de script consolidado e otimizado para o site

// // 1. Configuração do Supabase (Substitua pelos seus dados reais)
const SUPABASE_URL = 'https://tutftcxochiptvizqlci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dGZ0Y3hvY2hpcHR2aXpxbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjQyMDAsImV4cCI6MjA4NzIwMDIwMH0.lWoYhKcgXElgrEJFYc_DXi-1lql6HWMXxmGsCPXFEak';





// Validação e Formatação Híbrida (CPF/CNPJ) para o Header
// Adiciona o ouvinte de eventos no documento inteiro
document.addEventListener('input', function (event) {

    // Verifica se a digitação aconteceu no campo específico do popup
    if (event.target && event.target.id === 'login-username') {

        // 1. Remove tudo que não é número
        let value = event.target.value.replace(/\D/g, "");

        // 2. Trava o tamanho máximo em 14 números
        if (value.length > 14) {
            value = value.substring(0, 14);
        }

        // 3. Aplica a formatação
        if (value.length <= 11) {
            // CPF: 000.000.000-00
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else {
            // CNPJ: 00.000.000/0000-00
            value = value.replace(/^(\d{2})(\d)/, "$1.$2");
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
            value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
        }

        // 4. Atualiza o input
        event.target.value = value;
    }
});

// Verifica se existe um usuário no localStorage
const estaLogado = () => !!localStorage.getItem('usuarioEcoClass');


document.addEventListener('DOMContentLoaded', function () {
    // --- LÓGICA GERAL PARA CARREGAR CABEÇALHO E RODAPÉ (compartilhada) ---


    // Carrega o conteúdo HTML de um arquivo e o insere em um elemento
    function loadHTML(url, elementId) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                const targetElement = document.getElementById(elementId);
                if (targetElement) {
                    targetElement.innerHTML = html;

                    if (elementId === 'header-placeholder') {
                        setupHeaderPopups();
                    }
                    if (elementId === 'footer-placeholder') {
                        setupFooterButton();
                        setupFooterLinks();
                    }
                }
            })
            .catch(error => console.error(`Erro ao carregar ${url}:`, error));
    }

    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder');

    // Configura o botão "Voltar ao Topo"
    function setupFooterButton() {
        const backToTopButton = document.getElementById('backToTopBtn');
        if (backToTopButton) {
            backToTopButton.addEventListener('click', function () {
                scrollToTop(1500);
            });
        }
    }

    // Função de rolagem suave para o topo da página
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



    // function setupHeaderPopups() {

    //     // --- LÓGICA DO MENU MOBILE (Adicione aqui) ---
    //     const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    //     const mainNav = document.getElementById('mainNav');

    //     if (mobileMenuIcon && mainNav) {
    //         mobileMenuIcon.addEventListener('click', () => {
    //             mainNav.classList.toggle('active');
    //             mobileMenuIcon.classList.toggle('toggle');
    //         });

    //         // Fecha o menu ao clicar em um link
    //         document.querySelectorAll('.nav-item').forEach(link => {
    //             link.addEventListener('click', () => {
    //                 mainNav.classList.remove('active');
    //                 mobileMenuIcon.classList.remove('toggle');
    //             });
    //         });
    //     }

function setupHeaderPopups() {
    const loginInfo = document.getElementById('loginInfo');
    const loginPopup = document.getElementById('loginPopup');
    const dadosSalvos = localStorage.getItem('usuarioEcoClass');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    const mainNav = document.getElementById('mainNav');

    // --- 1. VERIFICAÇÃO DE LOGIN E RENDERIZAÇÃO DO POPUP ---
    if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);

        // Atualiza o Header
        const nameDisplay = document.getElementById('userNameDisplay');
        const pointsDisplay = document.getElementById('userPointsDisplay');
        if (nameDisplay) nameDisplay.textContent = usuario.nome.toUpperCase();
        if (pointsDisplay) pointsDisplay.textContent = `PONTOS: ${usuario.qtd_pontos}`;

        // Altera o conteúdo do Popup para exibir Perfil e Logoff
        if (loginPopup) {
            loginPopup.innerHTML = `
                <div class="user-profile-panel" style="padding: 10px; color: white;">
                    <h2 style="margin-bottom: 15px;">Minha Conta</h2>
                    <p style="margin: 5px 0;"><strong>Olá, ${usuario.nome.split(' ')[0]}!</strong></p>
                    <p style="margin: 5px 0;">Pontos: ${usuario.qtd_pontos}</p>
                    <p style="margin: 5px 0;">Doações: ${usuario.doacoes || 0}</p>
                    <hr style="margin: 15px 0; border: 0; border-top: 1px solid rgba(255,255,255,0.2);">
                    <button id="btnLogoff" class="login-submit-btn">SAIR</button>
                </div>
            `;

            document.getElementById('btnLogoff').addEventListener('click', () => {
                localStorage.removeItem('usuarioEcoClass');
                window.location.href = 'index.html';
            });
        }
    }

    // --- 2. TRAVA DE NAVEGAÇÃO PARA DESLOGADOS ---
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            const paginasLivres = ['index.html', 'index.html#', '#', '/', 'Cad_PF.html', 'Cad_PJ.html'];
            
            if (!dadosSalvos && !paginasLivres.includes(href)) {
                event.preventDefault();
                alert("Por favor, faça login para acessar esta página!");
                loginPopup.style.display = 'block'; // Abre o login automaticamente
            } else {
                // Fecha menu mobile se estiver aberto
                if (mainNav) mainNav.classList.remove('active');
                if (mobileMenuIcon) mobileMenuIcon.classList.remove('toggle');
            }
        });
    });

    // --- 3. LÓGICA DE ABRIR/FECHAR POPUP ---
    if (loginInfo && loginPopup) {
        loginInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            loginPopup.style.display = loginPopup.style.display === 'block' ? 'none' : 'block';
        });
    }

    // --- 4. LÓGICA DE LOGIN (APENAS SE NÃO LOGADO) ---
    const loginForm = document.getElementById('loginForm');
    if (!dadosSalvos && loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const input_login = document.getElementById('login-username');
            const mensagem = document.getElementById('loginError');
            const senha = document.getElementById('login-password').value;

            let cpf = input_login.value.length === 14 ? input_login.value : null;
            let cnpj = input_login.value.length === 18 ? input_login.value : null;

            if (!cpf && !cnpj) {
                mensagem.textContent = 'CPF/CNPJ inválido.';
                mensagem.style.display = 'block';
                return;
            }

            try {
                let query = _supabase.from('Usuarios').select('*');
                if (cpf) query = query.eq('cpf', cpf);
                else query = query.eq('cnpj', cnpj);

                const { data: usuario, error } = await query.eq('senha', senha).single();

                if (error || !usuario) {
                    mensagem.style.display = 'block';
                    return;
                }

                localStorage.setItem('usuarioEcoClass', JSON.stringify({
                    nome: usuario.nome,
                    qtd_pontos: usuario.qtd_pontos,
                    doacoes: usuario.qtd_doacoes || 0,
                    id: usuario.id
                }));
                window.location.reload();
            } catch (err) {
                console.error(err);
            }
        });
    }

    // Fechar ao clicar fora
    document.addEventListener('click', (event) => {
        if (loginPopup && !loginInfo.contains(event.target) && !loginPopup.contains(event.target)) {
            loginPopup.style.display = 'none';
        }
    });






















// function setupHeaderPopups() {
//     const mobileMenuIcon = document.getElementById('mobileMenuIcon');
//     const mainNav = document.getElementById('mainNav');

//     if (mobileMenuIcon && mainNav) {
//         mobileMenuIcon.addEventListener('click', () => {
//             mainNav.classList.toggle('active');
//             mobileMenuIcon.classList.toggle('toggle');
//         });

//         // Seleciona todos os links de navegação
//         document.querySelectorAll('.nav-item').forEach(link => {
//             link.addEventListener('click', (event) => {
//                 // Se NÃO estiver logado e o link NÃO for para a home ('index.html' ou '#')
//                 const href = link.getAttribute('href');
//                 if (!estaLogado() && href !== 'index.html' && href !== '#' && href !== '/') {
//                     event.preventDefault(); // Impede a navegação
//                     alert("Acesso restrito! Por favor, faça login para acessar esta página.");
//                     window.location.href = 'index.html'; // Redireciona para o início
//                     return;
//                 }

//                 // Lógica original de fechar o menu mobile
//                 mainNav.classList.remove('active');
//                 mobileMenuIcon.classList.remove('toggle');
//             });
//         });
//     }
    
 



//         // --- 1. VERIFICAÇÃO DE PERSISTÊNCIA (AO CARREGAR A PÁGINA) ---
//         const dadosSalvos = localStorage.getItem('usuarioEcoClass');
//         if (dadosSalvos) {
//             const usuario = JSON.parse(dadosSalvos);

//             const nameDisplay = document.getElementById('userNameDisplay');
//             const pointsDisplay = document.getElementById('userPointsDisplay');
//             const pagePointsValue = document.getElementById('pagePointsValue');
//             const pageDonationsValue = document.getElementById('pageDonationsValue');

//             if (nameDisplay) nameDisplay.textContent = usuario.nome.toUpperCase();
//             if (pointsDisplay) pointsDisplay.textContent = `PONTOS: ${usuario.qtd_pontos}`;

//             // Alimenta os dados na página de pontuação, se o usuário estiver nela
//             if (pagePointsValue) pagePointsValue.textContent = usuario.qtd_pontos;
//             if (pageDonationsValue) pageDonationsValue.textContent = usuario.doacoes || 0;
//         }

//         // --- 2. SELEÇÃO DE ELEMENTOS ---
//         const loginInfo = document.getElementById('loginInfo');
//         const loginPopup = document.getElementById('loginPopup');
//         const loginForm = document.getElementById('loginForm');

//         // --- 3. LÓGICA DE LOGIN ---
//         if (loginInfo && loginPopup) {
//             loginInfo.addEventListener('click', function (event) {
//                 event.stopPropagation();
//                 loginPopup.style.display = loginPopup.style.display === 'block' ? 'none' : 'block';
//             });

//             if (loginForm) {
//                 loginForm.addEventListener('submit', async function (event) {
//                     event.preventDefault();

//                     const input_login = document.getElementById('login-username');
//                     const mensagem = document.getElementById('loginError');

//                     let cpf = null;
//                     let cnpj = null;

//                     const tamanhoInput = input_login.value.length;
//                     if (tamanhoInput === 14) {
//                         cpf = input_login.value;
//                     }
//                     else if (tamanhoInput === 18) {
//                         cnpj = input_login.value;
//                     }
//                     else {
//                         mensagem.textContent = 'Por favor, insira o CPF ou CNPJ formatado.';
//                         mensagem.style.display = 'block';
//                         return;
//                     }

//                     const senha = document.getElementById('login-password').value;

//                     try {
//                         let query = _supabase.from('Usuarios').select('*');

//                         if (cpf) query = query.eq('cpf', cpf);
//                         else if (cnpj) query = query.eq('cnpj', cnpj);

//                         const { data: usuario, error } = await query.eq('senha', senha).single();

//                         if (error || !usuario) {
//                             mensagem.textContent = 'CPF/CNPJ ou senha incorretos.';
//                             mensagem.style.display = 'block';
//                             return;
//                         }

//                         const dadosParaPersistir = {
//                             nome: usuario.nome,
//                             qtd_pontos: usuario.qtd_pontos,
//                             doacoes: usuario.qtd_doacoes || 0,
//                             id: usuario.id
//                         };

//                         localStorage.setItem('usuarioEcoClass', JSON.stringify(dadosParaPersistir));
//                         window.location.reload();

//                     } catch (err) {
//                         console.error('Erro:', err);
//                         mensagem.textContent = 'Erro ao conectar com o servidor.';
//                         mensagem.style.display = 'block';
//                     }
//                 });
//             }
//         }

//         // --- 4. FECHAMENTO DO LOGIN CLICANDO FORA ---

//         // ao clicar no link do rodapé abre o popup de login, mas sem que o clique seja propagado para o documento, para evitar que o clique abra e feche o popup ao mesmo tempo.
//         footerLoginLink.addEventListener('click', function (event) {
//             event.preventDefault();
//             event.stopPropagation();
//             loginPopup.style.display = 'block';
//         });

//         document.addEventListener('click', function (event) {
//             if (loginPopup && loginPopup.style.display === 'block') {
//                 // Se o clique não foi no botão de login nem dentro do popup, fecha ele
//                 if (loginInfo && !loginInfo.contains(event.target) && !loginPopup.contains(event.target)) {
//                     loginPopup.style.display = 'none';
//                 }
//             }
//         });

        // Configura os links do rodapé (Apenas para o Login agora)
        function setupFooterLinks() {
            const footerLoginLink = document.getElementById('footerLoginLink');
            const loginPopup = document.getElementById('loginPopup');

            if (footerLoginLink && loginPopup) {
                footerLoginLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    loginPopup.style.display = 'block';
                });
            }
        }
    }

    // Função auxiliar para exibir mensagens de validação
    function showValidationMessage(element, message) {
        const existingMessage = element.parentNode.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'validation-message';
        messageDiv.textContent = message;
        element.classList.add('is-invalid');
        element.insertAdjacentElement('afterend', messageDiv);

        setTimeout(() => {
            messageDiv.remove();
            element.classList.remove('is-invalid');
        }, 4000);
    }

    // Funçao auxiliar para exibir mensagens de sucesso COM redirecionamento
    function showSuccessMessage(message, redirectUrl) {
        const successMessage = document.createElement('div');
        successMessage.className = 'solicitacao-sucesso';
        successMessage.textContent = message;
        document.body.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
            window.location.href = redirectUrl;
        }, 3000);
    }

    // --- LÓGICA DE CATEGORIAS E PONTUAÇÃO DINÂMICA ---
    let mapCategorias = {};
    let basePointsMap = {};

    async function carregarConfiguracoesPontuacao() {
        try {
            const { data: dadosPontuacao, error } = await _supabase
                .from('Pontuacao')
                .select('id, categoria, pont_min')
                .eq('status', true);

            if (error) throw error;

            if (dadosPontuacao) {
                const categoriaSelect = document.getElementById('categoria');
                if (categoriaSelect) categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

                dadosPontuacao.forEach(item => {
                    mapCategorias[item.id] = item.categoria;
                    basePointsMap[item.id] = Number(item.pont_min);

                    if (categoriaSelect) {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = item.categoria;
                        categoriaSelect.appendChild(option);
                    }
                });
            }
            console.log("Configurações de pontuação carregadas com sucesso.");
        } catch (err) {
            console.error("Erro ao carregar dados de pontuação:", err.message);
        }
    }

    carregarConfiguracoesPontuacao();

    // --- LÓGICA DO FORMULÁRIO DE DOAÇÃO (QUERODOAR.HTML) ---
    const materialFormContainer = document.querySelector('.doar-form-container');
    if (materialFormContainer) {
        const submitBtn = materialFormContainer.querySelector('.doar-submit-btn');

        if (submitBtn) {
            submitBtn.addEventListener('click', async function (event) {
                event.preventDefault();

                const fileInput = document.getElementById('imagem');
                const categoriaSelect = document.getElementById('categoria');
                const nomeInput = document.getElementById('nome');
                const descricaoTextarea = document.getElementById('descricao');
                const pontoSelect = document.getElementById('ponto');
                const ratingInput = document.getElementById('doarRatingValue');

                if (!ID_USUARIO_LOGADO) {
                    alert("Você precisa estar logado para cadastrar um material!");
                    return;
                }

                try {
                    submitBtn.innerText = "Enviando...";
                    submitBtn.disabled = true;

                    // 1. Upload da Imagem

                    //Validação se existe imagem carregada antes de tentar fazer upload, para evitar erros desnecessários.
                    if (!fileInput.files[0]) {
                        alert("Por favor, carregue uma imagem.");
                        return;
                    }

                    let urlPublica = null; // Variável para armazenar a URL pública da imagem após o upload
                    const arquivo = fileInput.files[0];
                    if (arquivo) { //Verifica se o usuário selecionou um arquivo antes de tentar fazer upload
                        const reader = new FileReader();
                        reader.onload = async function () {
                            const base64String = reader.result.split(',')[1];
                            const nomeArquivo = `${Date.now()}_${arquivo.name}`;
                            const { data: uploadData, error: uploadError } = await _supabase.storage
                                .from('imagens')
                                .upload('img/' + nomeArquivo, arquivo);

                            if (uploadError) throw uploadError;

                            const { data: urlData } = _supabase.storage
                                .from('imagens')
                                .getPublicUrl('img/' + nomeArquivo);
                            urlPublica = urlData.publicUrl;
                        }
                    }

                    // 2. Inserção na Tabela Doacao
                    const catId = parseInt(categoriaSelect.value);
                    if (!catId) throw new Error("Selecione uma categoria válida.");

                    const estrelas = parseInt(ratingInput.value) || 0;

                    const { error: errorDoacao } = await _supabase
                        .from('Doacao')
                        .insert([{
                            item: nomeInput.value,
                            descricao: descricaoTextarea.value,
                            x_id_categoria: catId,
                            estado: estrelas,
                            ponto_entrega: pontoSelect.value,
                            x_id_usuario: ID_USUARIO_LOGADO,
                            imagem: urlPublica,
                            disponivel: true
                        }]);

                    if (errorDoacao) throw errorDoacao;

                    // 3. Atualização de Pontos do Usuário
                    const { data: usuario, error: errorUser } = await _supabase
                        .from('Usuarios')
                        .select('qtd_pontos, qtd_doacoes')
                        .eq('id', ID_USUARIO_LOGADO)
                        .single();

                    if (errorUser) throw errorUser;

                    const pontosDaCategoria = basePointsMap[catId] || 0;
                    const novosPontos = (usuario.qtd_pontos || 0) + pontosDaCategoria + estrelas;
                    const novasDoacoes = (usuario.qtd_doacoes || 0) + 1;

                    const { error: errorUpdate } = await _supabase
                        .from('Usuarios')
                        .update({ qtd_pontos: novosPontos, qtd_doacoes: novasDoacoes })
                        .eq('id', ID_USUARIO_LOGADO);

                    if (errorUpdate) throw errorUpdate;

                    // 4. Atualização do Cache Local
                    const usuarioLocal = JSON.parse(localStorage.getItem('usuarioEcoClass'));
                    if (usuarioLocal) {
                        usuarioLocal.qtd_pontos = novosPontos;
                        usuarioLocal.qtd_doacoes = novasDoacoes;
                        localStorage.setItem('usuarioEcoClass', JSON.stringify(usuarioLocal));
                    }

                    if (typeof confetti === 'function') {
                        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
                    }
                    showSuccessMessage('Sucesso! Material cadastrado e pontos recebidos.', 'index.html');

                } catch (error) {
                    console.error('Erro geral:', error.message);
                    alert('Erro ao processar cadastro: ' + error.message);
                } finally {
                    submitBtn.innerText = "Cadastrar";
                    submitBtn.disabled = false;
                }
            });
        }


        // Lógica do sistema de estrelas para a página de doação
        const starsContainer = document.getElementById('doar-stars');
        if (starsContainer) {
            const stars = starsContainer.querySelectorAll('.doar-star');
            let ratingInput = document.getElementById('doarRatingValue');
            if (!ratingInput) {
                ratingInput = document.createElement('input');
                ratingInput.type = 'hidden';
                ratingInput.id = 'doarRatingValue';
                ratingInput.name = 'estadoMaterial';
                ratingInput.value = '0';
                starsContainer.appendChild(ratingInput);
            }

            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const value = parseInt(star.getAttribute('data-value'));
                    ratingInput.value = value;
                    stars.forEach((s, index) => {
                        if (index < value) {
                            s.classList.add('filled');
                        } else {
                            s.classList.remove('filled');
                        }
                    });
                });
                star.addEventListener('mouseover', () => {
                    const value = parseInt(star.getAttribute('data-value'));
                    stars.forEach((s, index) => {
                        if (index < value) {
                            s.classList.add('hover-filled');
                        } else {
                            s.classList.remove('hover-filled');
                        }
                    });
                });
                star.addEventListener('mouseout', () => {
                    stars.forEach(s => s.classList.remove('hover-filled'));
                    const currentValue = parseInt(ratingInput.value);
                    stars.forEach((s, index) => {
                        if (index < currentValue) {
                            s.classList.add('filled');
                        } else {
                            s.classList.remove('filled');
                        }
                    });
                });
            });
            const initialRating = parseInt(ratingInput.value);
            if (initialRating > 0) {
                stars.forEach((s, index) => {
                    if (index < initialRating) {
                        s.classList.add('filled');
                    }
                });
            }
        }

        // Lógica do upload de imagem para a página de doação
        const imageUploadContainer = document.getElementById('imageUploadContainer');
        const fileInput = document.getElementById('imagem');
        const imagePreview = document.getElementById('imagePreview');
        const cameraIcon = document.querySelector('.doar-camera-icon');
        const uploadText = document.querySelector('.doar-image-upload p');

        if (imageUploadContainer && fileInput && imagePreview) {
            imageUploadContainer.addEventListener('click', () => {
                fileInput.click();
            });
            fileInput.addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                        if (cameraIcon) cameraIcon.style.display = 'none';
                        if (uploadText) uploadText.style.display = 'none';
                        imageUploadContainer.classList.add('has-image');
                    };
                    reader.readAsDataURL(file);
                } else {
                    imagePreview.src = '';
                    imagePreview.style.display = 'none';
                    if (cameraIcon) cameraIcon.style.display = 'block';
                    if (uploadText) uploadText.style.display = 'block';
                    imageUploadContainer.classList.remove('has-image');
                }
            });
            imageUploadContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                imageUploadContainer.classList.add('drag-over');
            });
            imageUploadContainer.addEventListener('dragleave', () => {
                imageUploadContainer.classList.remove('drag-over');
            });
            imageUploadContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                imageUploadContainer.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    const event = new Event('change');
                    fileInput.dispatchEvent(event);
                }
            });
        }
    }

    // Lógica para a página "Preciso Receber" (precisoreceber.html)
    const solicitacaoForm = document.getElementById('solicitacaoForm');
    if (solicitacaoForm) {
        // Star rating functionality (Non-interactive)
        const starsContainer = document.getElementById('receber-stars');
        if (starsContainer) {
            const stars = starsContainer.querySelectorAll('.receber-star');
            const ratingInput = document.getElementById('ratingValue');
            const initialRating = parseInt(ratingInput.value);
            if (initialRating > 0) {
                stars.forEach((s, index) => {
                    if (index < initialRating) {
                        s.classList.add('filled');
                    }
                });
            }
        }

        // Simulação do formulário de solicitação
        solicitacaoForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Cria um modal ou um elemento de mensagem para exibir o sucesso
            const successMessage = document.createElement('div');
            successMessage.className = 'solicitacao-sucesso';
            successMessage.textContent = 'Material solicitado com sucesso! Redirecionando...';

            // Adiciona a mensagem ao corpo do documento
            document.body.appendChild(successMessage);

            // Código para disparar os confetes
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 }
                });
            }

            // Redireciona após 3 segundos
            setTimeout(function () {
                window.location.href = 'EcoClassReceberMaterial.html';
            }, 3000); // 3 seconds
        });
    }



    // Lógica para as páginas de cadastro PF e PJ
    const formPessoaFisica = document.getElementById('formPessoaFisica');
    const formPessoaJuridica = document.getElementById('formPessoaJuridica');

    if (formPessoaFisica) {
        const btnPessoaJuridica = document.getElementById('btnPessoaJuridica');
        const cpfInput = document.getElementById('cpf');
        const contatoInput = document.getElementById('contato');
        const cepInput = document.getElementById('cep');
        const souEstudanteCheckbox = document.getElementById('sou-estudante');
        const naoSouEstudanteCheckbox = document.getElementById('nao-sou-estudante');
        const escolaSelect = document.getElementById('escola');
        const nivelEscolarSelect = document.getElementById('nivel-escolar');
        const formGroupEscola = escolaSelect ? escolaSelect.closest('.cad-form-group') : null;
        const formGroupNivelEscolar = nivelEscolarSelect ? nivelEscolarSelect.closest('.cad-form-group') : null;

        if (btnPessoaJuridica) btnPessoaJuridica.addEventListener('click', function () { window.location.href = 'Cad_PJ.html'; });

        if (cpfInput) cpfInput.addEventListener('input', function (event) {
            let valor = event.target.value.replace(/\D/g, "").substring(0, 11);
            if (valor.length > 9) valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
            else if (valor.length > 6) valor = valor.replace(/^(\d{3})(\d{3})(\d{3}).*/, '$1.$2.$3');
            else if (valor.length > 3) valor = valor.replace(/^(\d{3})(\d{3}).*/, '$1.$2');
            else if (valor.length >= 1) valor = valor.replace(/^(\d{3}).*/, '$1');
            event.target.value = valor;
        });


        if (contatoInput) contatoInput.addEventListener('input', function (event) {
            let valor = event.target.value.replace(/\D/g, "").substring(0, 11);
            if (valor.length > 10) valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            else if (valor.length > 6) valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            else if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            else if (valor.length > 0) valor = valor.replace(/^(\d*)/, '($1');
            event.target.value = valor;
        });

        if (cepInput) cepInput.addEventListener('input', function (event) {
            let valor = event.target.value.replace(/\D/g, "").substring(0, 8);
            if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d{1,3}).*/, '$1-$2');
            event.target.value = valor;
        });

        if (souEstudanteCheckbox && naoSouEstudanteCheckbox && formGroupEscola && formGroupNivelEscolar) {
            function gerenciarCamposEstudante() {
                if (souEstudanteCheckbox.checked) {
                    formGroupEscola.style.display = 'block';
                    formGroupNivelEscolar.style.display = 'block';
                    void formGroupEscola.offsetWidth;
                    void formGroupNivelEscolar.offsetWidth;
                    formGroupEscola.classList.add('show');
                    formGroupNivelEscolar.classList.add('show');
                    escolaSelect.setAttribute('required', 'required');
                    nivelEscolarSelect.setAttribute('required', 'required');
                } else {
                    formGroupEscola.classList.remove('show');
                    formGroupNivelEscolar.classList.remove('show');
                    const hideAfterTransition = (element) => {
                        const onTransitionEnd = () => {
                            if (!element.classList.contains('show')) {
                                element.style.display = 'none';
                                element.removeEventListener('transitionend', onTransitionEnd);
                            }
                        };
                        element.addEventListener('transitionend', onTransitionEnd);
                    };
                    hideAfterTransition(formGroupEscola);
                    hideAfterTransition(formGroupNivelEscolar);
                    escolaSelect.value = "";
                    nivelEscolarSelect.value = "";
                    escolaSelect.removeAttribute('required');
                    nivelEscolarSelect.removeAttribute('required');
                    escolaSelect.classList.remove('is-invalid');
                    nivelEscolarSelect.classList.remove('is-invalid');
                    const escolaMessage = formGroupEscola.querySelector('.validation-message');
                    if (escolaMessage) escolaMessage.remove();
                    const nivelMessage = formGroupNivelEscolar.querySelector('.validation-message');
                    if (nivelMessage) nivelMessage.remove();
                }
            }
            souEstudanteCheckbox.addEventListener('change', function () {
                if (this.checked) naoSouEstudanteCheckbox.checked = false;
                gerenciarCamposEstudante();
            });
            naoSouEstudanteCheckbox.addEventListener('change', function () {
                if (this.checked) souEstudanteCheckbox.checked = false;
                gerenciarCamposEstudante();
            });
            gerenciarCamposEstudante();
        }

        formPessoaFisica.addEventListener('submit', function (event) {
            event.preventDefault();
            let isValid = true;
            formPessoaFisica.querySelectorAll('.validation-message').forEach(msg => msg.remove());
            formPessoaFisica.querySelectorAll('.is-invalid').forEach(field => field.classList.remove('is-invalid'));
            const requiredFields = formPessoaFisica.querySelectorAll('input[required], select[required]');
            requiredFields.forEach(field => {
                if (field.value.trim() === '' || (field.type === 'checkbox' && !field.checked && field.name === 'tipo_usuario_pf')) {
                    if (field.name === 'tipo_usuario_pf' && !souEstudanteCheckbox.checked && !naoSouEstudanteCheckbox.checked) {
                        showValidationMessage(souEstudanteCheckbox.closest('.cad-form-row'), "Por favor, selecione se você é 'estudante' ou 'não estudante'.");
                        isValid = false;
                    } else if (field.value.trim() === '') {
                        showValidationMessage(field, 'Este campo é obrigatório.');
                        isValid = false;
                    }
                }
            });
            const senhaInput = document.getElementById('senha');
            const confirmarSenhaInput = document.getElementById('confirmar-senha');
            if (senhaInput && confirmarSenhaInput) {
                if (senhaInput.value.length < 6) {
                    showValidationMessage(senhaInput, 'A senha deve ter pelo menos 6 caracteres.');
                    isValid = false;
                } else if (senhaInput.value !== confirmarSenhaInput.value) {
                    showValidationMessage(confirmarSenhaInput, 'As senhas não coincidem. Por favor, verifique.');
                    isValid = false;
                }
            }
            if (isValid) {
                console.log('Cadastro finalizado! Faça login para acessar.');
                formPessoaFisica.reset();
                gerenciarCamposEstudante();
                showSuccessMessage('Cadastro realizado com sucesso!', 'index.html');
            }
        });
    }

    if (formPessoaJuridica) {
        const btnPessoaFisica = document.getElementById('btnPessoaFisica');
        const cnpjInput = document.getElementById('cnpj');
        const ieInput = document.getElementById('ie');
        const isentoCheckbox = document.getElementById('isento');
        const instituicaoEnsinoCheckbox = document.getElementById('instituicao-ensino');
        const empresaDoadoraCheckbox = document.getElementById('empresa-doadora');
        const codigoInepInput = document.getElementById('codigo-inep');
        const contatoInput = document.getElementById('contato');
        const cepInput = document.getElementById('cep');
        const formGroupCodigoInep = codigoInepInput ? codigoInepInput.closest('.cad-form-group') : null;

        if (btnPessoaFisica) btnPessoaFisica.addEventListener('click', function () { window.location.href = 'Cad_PF.html'; });

        if (cnpjInput) cnpjInput.addEventListener('input', function (event) {
            let valor = event.target.value.replace(/\D/g, "").substring(0, 14);
            if (valor.length > 12) valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
            else if (valor.length > 8) valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4}).*/, '$1.$2.$3/$4');
            else if (valor.length > 5) valor = valor.replace(/^(\d{2})(\d{3})(\d{3}).*/, '$1.$2.$3');
            else if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d{3}).*/, '$1.$2');
            event.target.value = valor;
        });

        if (contatoInput) contatoInput.addEventListener('input', function (event) {
            let valor = event.target.value.replace(/\D/g, "").substring(0, 11);
            if (valor.length > 10) valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            else if (valor.length > 6) valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            else if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            else if (valor.length > 0) valor = valor.replace(/^(\d*)/, '($1');
            event.target.value = valor;
        });

        if (cepInput) cepInput.addEventListener('input', function (event) {
            let valor = event.target.value.replace(/\D/g, "").substring(0, 8);
            if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d{1,3}).*/, '$1-$2');
            event.target.value = valor;
        });

        if (ieInput && isentoCheckbox) {
            function validarInputIE(valor) { const apenasNumeros = /^\d*$/; return apenasNumeros.test(valor); }
            ieInput.addEventListener('input', function (event) {
                let valorIE = event.target.value.trim();
                if (!validarInputIE(valorIE)) { event.target.value = valorIE.replace(/\D/g, ""); return; }
                if (valorIE !== "") { isentoCheckbox.checked = false; isentoCheckbox.disabled = true; isentoCheckbox.style.cursor = 'not-allowed'; }
                else { isentoCheckbox.disabled = false; isentoCheckbox.style.cursor = 'pointer'; }
            });
            isentoCheckbox.addEventListener('change', function () {
                if (isentoCheckbox.checked) {
                    ieInput.value = '';
                    ieInput.removeAttribute('required');
                    ieInput.classList.remove('is-invalid');
                    const ieMessage = ieInput.parentNode.querySelector('.validation-message');
                    if (ieMessage) ieMessage.remove();
                }
            });
        }

        if (instituicaoEnsinoCheckbox && empresaDoadoraCheckbox && formGroupCodigoInep) {
            function gerenciarTipoEntidade() {
                if (instituicaoEnsinoCheckbox.checked) {
                    empresaDoadoraCheckbox.checked = false;
                    formGroupCodigoInep.style.display = 'block';
                    void formGroupCodigoInep.offsetWidth;
                    formGroupCodigoInep.classList.add('show');
                    codigoInepInput.setAttribute('required', 'required');
                    codigoInepInput.focus();
                } else if (empresaDoadoraCheckbox.checked) {
                    instituicaoEnsinoCheckbox.checked = false;
                    formGroupCodigoInep.classList.remove('show');
                    const hideAfterTransition = (element) => {
                        const onTransitionEnd = () => {
                            if (!element.classList.contains('show')) {
                                element.style.display = 'none';
                                element.removeEventListener('transitionend', onTransitionEnd);
                            }
                        };
                        element.addEventListener('transitionend', onTransitionEnd);
                    };
                    hideAfterTransition(formGroupCodigoInep);
                    codigoInepInput.value = '';
                    codigoInepInput.removeAttribute('required');
                    codigoInepInput.classList.remove('is-invalid');
                    const inepMessage = formGroupCodigoInep.querySelector('.validation-message');
                    if (inepMessage) inepMessage.remove();
                } else {
                    formGroupCodigoInep.classList.remove('show');
                    const hideAfterTransition = (element) => {
                        const onTransitionEnd = () => {
                            if (!element.classList.contains('show')) {
                                element.style.display = 'none';
                                element.removeEventListener('transitionend', onTransitionEnd);
                            }
                        };
                        element.addEventListener('transitionend', onTransitionEnd);
                    };
                    hideAfterTransition(formGroupCodigoInep);
                    codigoInepInput.value = '';
                    codigoInepInput.removeAttribute('required');
                    codigoInepInput.classList.remove('is-invalid');
                    const inepMessage = formGroupCodigoInep.querySelector('.validation-message');
                    if (inepMessage) inepMessage.remove();
                }
                if (!instituicaoEnsinoCheckbox.checked && !empresaDoadoraCheckbox.checked && formGroupCodigoInep) {
                    formGroupCodigoInep.style.display = 'none';
                }
            }
            instituicaoEnsinoCheckbox.addEventListener('change', gerenciarTipoEntidade);
            empresaDoadoraCheckbox.addEventListener('change', gerenciarTipoEntidade);
            gerenciarTipoEntidade();
        }

        formPessoaJuridica.addEventListener('submit', function (event) {
            event.preventDefault();
            let isValid = true;
            formPessoaJuridica.querySelectorAll('.validation-message').forEach(msg => msg.remove());
            formPessoaJuridica.querySelectorAll('.is-invalid').forEach(field => field.classList.remove('is-invalid'));
            const requiredFields = formPessoaJuridica.querySelectorAll('input[required], select[required]');
            for (const field of requiredFields) {
                if (field.value.trim() === '') {
                    showValidationMessage(field, 'Este campo é obrigatório.');
                    isValid = false;
                }
            }
            const valorIE = ieInput.value.trim();
            if (valorIE === "" && !isentoCheckbox.checked) {
                showValidationMessage(ieInput, "Para concluir, preencha a Inscrição Estadual ou marque 'Sou ISENTO'.");
                isValid = false;
            }
            if (!instituicaoEnsinoCheckbox.checked && !empresaDoadoraCheckbox.checked) {
                showValidationMessage(instituicaoEnsinoCheckbox.closest('.cad-form-row'), "Por favor, selecione 'Instituição de ensino' ou 'Empresa doadora'.");
                isValid = false;
            }
            if (instituicaoEnsinoCheckbox.checked && codigoInepInput.value.trim().length !== 8) {
                showValidationMessage(codigoInepInput, "Por favor, digite um Código INEP válido com 8 dígitos.");
                isValid = false;
            }
            const senhaInput = document.getElementById('senha');
            const confirmarSenhaInput = document.getElementById('confirmar-senha');
            if (senhaInput && confirmarSenhaInput) {
                if (senhaInput.value.length < 6) {
                    showValidationMessage(senhaInput, 'A senha deve ter pelo menos 6 caracteres.');
                    isValid = false;
                } else if (senhaInput.value !== confirmarSenhaInput.value) {
                    showValidationMessage(confirmarSenhaInput, 'As senhas não coincidem. Por favor, verifique.');
                    isValid = false;
                }
            }
            if (isValid) {
                console.log('Cadastro finalizado! Faça login para acessar.');
                formPessoaJuridica.reset();
                gerenciarTipoEntidade();
                showSuccessMessage('Cadastro realizado com sucesso!', 'index.html');
            }
        });
    }
});

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const ID_USUARIO_LOGADO = JSON.parse(localStorage.getItem('usuarioEcoClass'))?.id;
const ID_DOACAO_ATUAL = 1;



document.addEventListener('DOMContentLoaded', () => {
    const solicitacaoForm = document.getElementById('solicitacaoForm');


    if (solicitacaoForm) {
        solicitacaoForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Botão clicado, iniciando integração...");


            const btn = solicitacaoForm.querySelector('.receber-submit-btn');
            btn.innerText = "Gravando no Banco...";
            btn.disabled = true;


            try {
                // 1. Grava na tabela 'Receber'
                const { data, error: errorReceber } = await _supabase
                    .from('Receber')
                    .insert([
                        {
                            x_id_usuario_rec: ID_USUARIO_LOGADO,
                            x_id_doacao_item: ID_DOACAO_ATUAL
                        }
                    ]);


                if (errorReceber) throw errorReceber;


                // 2. Atualiza a tabela 'Doacao'
                const { error: errorDoacao } = await _supabase
                    .from('Doacao')
                    .update({ disponivel: false })
                    .eq('id', ID_DOACAO_ATUAL);


                if (errorDoacao) throw errorDoacao;


                // SUCESSO
                console.log("Dados inseridos com sucesso!");
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });


                alert('Sucesso! O dado foi gravado no Supabase.');
                btn.innerText = "Solicitado!";


            } catch (error) {
                console.error('Erro detalhado:', error);
                alert('Erro ao gravar: ' + error.message);
                btn.disabled = false;
                btn.innerText = "Solicitar";
            }
        });
    }
});


// 2. LÓGICA DE CADASTRO
document.addEventListener('DOMContentLoaded', () => {
    const formPF = document.getElementById('formPessoaFisica');

    if (formPF) {
        formPF.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Pegando os valores do formulário
            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const nascimento = document.getElementById('nascimento').value;
            const contato = document.getElementById('contato').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const souEstudante = document.getElementById('sou-estudante').checked;

            const cep = document.getElementById('cep').value;
            const logradouro = document.getElementById('logradouro').value;
            const bairro = document.getElementById('bairro').value;
            const cidade = document.getElementById('cidade').value;
            const uf = document.getElementById('uf').value;

            const btn = formPF.querySelector('.create-profile-btn');

            try {
                btn.innerText = "Cadastrando...";
                btn.disabled = true;

                // PASSO 1: Inserir na tabela 'Usuarios'
                const { data: userRecord, error: userError } = await _supabase
                    .from('Usuarios')
                    .insert([
                        {
                            nome: nome,
                            cpf: cpf,
                            dt_nscto: nascimento,
                            contato: contato,
                            "e-mail": email, // Certifique-se que o nome na tabela está com aspas e hífen
                            senha: senha,
                            estudante: souEstudante,
                            qtd_pontos: 0
                        }
                    ])
                    .select();

                if (userError) throw userError;

                const novoUsuarioId = userRecord[0].id;

                // PASSO 2: Inserir na tabela 'Enderecos'
                const { error: endError } = await _supabase
                    .from('Enderecos')
                    .insert([
                        {
                            x_id_usuario: novoUsuarioId,
                            cep: cep,
                            logradouro: logradouro,
                            bairro: bairro,
                            cidade: cidade,
                            uf: uf
                        }
                    ]);

                if (endError) throw endError;

                // SUCESSO
                alert('Conta criada com sucesso!');

                if (typeof confetti === 'function') {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }

                setTimeout(() => { window.location.href = 'index.html'; }, 2000);

            } catch (error) {
                console.error('Erro no cadastro:', error.message);
                alert('Erro ao cadastrar: ' + error.message);
            } finally {
                btn.innerText = "Criar Perfil";
                btn.disabled = false;
            }
        });
    }
});

// 3. VERIFICAÇÃO DE CONEXÃO (Direto no Supabase)
async function verificarConexao() {
    try {
        const { data, error } = await _supabase.from('Usuarios').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log("✅ Conexão com Supabase estabelecida.");
    } catch (err) {
        console.error("❌ Erro ao conectar ao Supabase:", err.message);
    }
}

window.addEventListener('load', verificarConexao);

let idMaterialSelecionado = null; // Variável global para saber o que está sendo solicitado


// 2. Função Principal de Listagem
async function carregarListaDeDoacoes(idCategoria = "", filtroMaterial = "", filtroQualidade = "0") {
    const container = document.getElementById('cards-container');
    if (!container) return;

    try {
        let query = _supabase
            .from('Doacao')
            .select('*, Pontuacao(categoria)')
            .eq('disponivel', true);

        // Aplicação dos Filtros
        if (idCategoria && idCategoria !== "Selecionar Opção") {
            console.log("Aplicando filtro de categoria ID:", idCategoria);
            // Como o idCategoria já é o número (ex: 2), passamos ele direto para a query!
            query = query.eq('x_id_categoria', idCategoria);
        }

        if (filtroMaterial && filtroMaterial.trim() !== "") {
            console.log("Aplicando filtro de material:", filtroMaterial);
            query = query.ilike('item', `%${filtroMaterial}%`);
        }

        if (filtroQualidade && filtroQualidade !== "0") {
            console.log("Aplicando filtro de qualidade:", filtroQualidade);
            query = query.gte('estado', filtroQualidade);
        }

        const { data: doacoes, error } = await query;

        if (error) throw error;

        container.innerHTML = ''; // Limpa uma única vez

        if (doacoes.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px; color: white;">Nenhum material encontrado com esses filtros.</p>';
            return;
        }

        doacoes.forEach(doacao => {
            const nivelEstado = parseInt(doacao.estado) || 0;
            let estrelasStr = "";
            for (let i = 1; i <= 5; i++) {
                estrelasStr += i <= nivelEstado ? "★ " : "☆ ";
            }

            const imgPath = doacao.imagem || 'https://via.placeholder.com/210x110?text=Sem+Imagem';

            const cardHTML = `
                <div class="card" onclick="abrirModalSolicitacao(${JSON.stringify(doacao).replace(/"/g, '&quot;')})">
                    <div class="foto-material">
                        <img src="${imgPath}" alt="${doacao.item}" width="210" height="110" style="object-fit: cover;">
                    </div>
                    <div class="card-content">
                        <h3>${doacao.item}</h3>
                        <p>${doacao.descricao}</p>
                        <div class="stars-visual" style="color: #FFD700;">
                            ${estrelasStr}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    } catch (err) {
        console.error("Erro ao carregar lista:", err.message);
    }
}

// 3. Funções do Modal (Independente do DOMContentLoaded)
function abrirModalSolicitacao(doacao) {
    idMaterialSelecionado = doacao.id;

    // IMPORTANTE: Como fizemos o join, o nome da categoria está dentro do objeto Pontuacao
    const nomeCategoria = doacao.Pontuacao ? doacao.Pontuacao.categoria : "Sem Categoria";

    document.getElementById('modal-categoria').value = nomeCategoria;
    document.getElementById('modal-item').value = doacao.item || '';
    document.getElementById('modal-img').src = doacao.imagem || 'https://via.placeholder.com/210x110?text=Sem+Imagem';
    document.getElementById('modal-descricao').value = doacao.descricao || '';

    const starsContainer = document.getElementById('modal-stars');
    const nivel = parseInt(doacao.estado) || 0;
    starsContainer.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        starsContainer.innerHTML += `<span class="receber-star ${i <= nivel ? 'filled' : ''}">★</span>`;
    }

    document.getElementById('modalSolicitacao').style.display = "block";
}

async function carregarCategoriasDropdown() {
    const selectCategoria = document.getElementById('categoria');
    if (!selectCategoria) return;

    try {
        // 1. Busca as categorias no banco de dados
        const { data: categorias, error } = await _supabase
            .from('Pontuacao')
            .select('id, categoria')
            .eq('status', true)
            .order('id', { ascending: true }); // Ordena do ID 1 ao 7 para ficar organizado

        if (error) throw error;

        // 2. Limpa o select e insere a opção padrão (Placeholder)
        selectCategoria.innerHTML = '<option value="" selected>Todas</option>';

        // 3. Cria as tags <option> para cada categoria encontrada
        if (categorias) {
            categorias.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id; // O value será o número (1, 2, 3...)
                option.textContent = item.categoria; // O texto será o nome (Escrita, Mochilas...)
                selectCategoria.appendChild(option);
            });
        }

        console.log("Categorias carregadas com sucesso no select!");

    } catch (err) {
        console.error("Erro ao preencher o select de categorias:", err.message);
    }
}

// 4. Inicialização de Eventos (Tudo dentro de UM único DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {

    // Carregamento Inicial
    carregarListaDeDoacoes();
    carregarCategoriasDropdown();

    // Fechamento do Modal ao clicar fora
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-modal') || e.target.id === 'modalSolicitacao') {
            document.getElementById('modalSolicitacao').style.display = "none";
        }
    });

    // Lógica das estrelas do Filtro lateral
    const filterStars = document.querySelectorAll('.filter-star');
    const filterRatingInput = document.getElementById('filter-rating-value');

    filterStars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            filterRatingInput.value = value;
            filterStars.forEach((s, index) => {
                index < value ? s.classList.add('filled') : s.classList.remove('filled');
            });
        });
    });

    // Ação do Botão Pesquisar
    const btnPesquisar = document.getElementById('btn-pesquisar');
    if (btnPesquisar) {
        btnPesquisar.addEventListener('click', () => {
            const categoria = document.getElementById('categoria').value;
            const material = document.getElementById('tipo-material').value;
            const qualidade = filterRatingInput.value;
            carregarListaDeDoacoes(categoria, material, qualidade);
        });
    }

    // Formulário de Solicitação
    const formModal = document.getElementById('solicitacaoFormModal');
    if (formModal) {
        formModal.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!ID_USUARIO_LOGADO) {
                alert("Você precisa estar logado para solicitar!");
                return;
            }

            const btn = formModal.querySelector('.receber-submit-btn');
            btn.innerText = "Processando...";
            btn.disabled = true;

            try {
                const { error: errorReceber } = await _supabase
                    .from('Receber')
                    .insert([{
                        x_id_usuario_rec: ID_USUARIO_LOGADO,
                        x_id_doacao_item: idMaterialSelecionado
                    }]);

                if (errorReceber) throw errorReceber;

                const { error: errorDoacao } = await _supabase
                    .from('Doacao')
                    .update({ disponivel: false })
                    .eq('id', idMaterialSelecionado);

                if (errorDoacao) throw errorDoacao;

                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                alert('Solicitação realizada com sucesso!');
                document.getElementById('modalSolicitacao').style.display = "none";
                carregarListaDeDoacoes();

            } catch (err) {
                alert("Erro: " + err.message);
            } finally {
                btn.innerText = "Solicitar";
                btn.disabled = false;
            }
        });
    }
});




// Função para buscar e preencher a tabela de pontuação
async function carregarTabelaPontuacao() {
    alert("Carregando categorias ativas...");
    const tbody = document.getElementById('tabela-pontuacao-body');
    if (!tbody) return; // Se a tabela não existir na página, a função para aqui

    try {
        // 1. Busca os dados no Supabase
        const { data: categorias, error } = await _supabase
            .from('Pontuacao')
            .select('*')
            .eq('status', true)
            .order('id', { ascending: true });

        if (error) throw error;

        // 2. Limpa o corpo da tabela
        tbody.innerHTML = '';

        // 3. Verifica se tem dados
        if (categorias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhuma categoria ativa encontrada.</td></tr>';
            return;
        }

        // 4. Preenche as linhas da tabela dinamicamente
        categorias.forEach(item => {
            const tr = document.createElement('tr');

            // Adiciona a classe de borda que você já usa no seu CSS
            tr.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";

            tr.innerHTML = `
                <td style="padding: 12px 10px;">${item.id}</td>
                <td style="padding: 12px 10px;">${item.categoria}</td>
                <td style="padding: 12px 10px;">${item.descricao}</td>
                <td style="padding: 12px 10px;">${item.pont_min} - ${item.pont_max} pts</td>
                <td style="padding: 12px 10px; text-align: center;">
                    <button onclick="inativarCategoria(${item.id})" 
                            style="background: none; border: none; cursor: pointer; font-size: 1.2em; transition: transform 0.2s;" 
                            title="Inativar Categoria"
                            onmouseover="this.style.transform='scale(1.2)'"
                            onmouseout="this.style.transform='scale(1)'">
                        🗑️
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Erro ao preencher tabela de pontuação:", err.message);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ffcccc;">Erro ao carregar as categorias.</td></tr>';
    }
}

// Função para inativar a categoria (Mudar status para false)
async function inativarCategoria(idCategoria) {
    // Pede uma confirmação antes de excluir
    const confirmacao = confirm("Tem certeza que deseja inativar esta categoria?");
    if (!confirmacao) return;

    try {
        const { error } = await _supabase
            .from('Pontuacao')
            .update({ status: false }) // Altera o status para inativo
            .eq('id', idCategoria);

        if (error) throw error;

        // Avisa que deu certo
        alert("Categoria inativada com sucesso!");

        // Recarrega a tabela para que o item inativado suma da tela
        carregarTabelaPontuacao();

        // Opcional: Se você estiver usando aquela função do Dropdown na mesma página, recarregue-a também:
        if (typeof carregarCategoriasDropdown === 'function') {
            carregarCategoriasDropdown();
        }

    } catch (err) {
        console.error("Erro ao inativar categoria:", err.message);
        alert("Erro ao inativar: " + err.message);
    }
}