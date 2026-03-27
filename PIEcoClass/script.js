// script.js - Arquivo de script consolidado e otimizado para o site

// // 1. Configuração do Supabase (Substitua pelos seus dados reais)
const SUPABASE_URL = 'https://tutftcxochiptvizqlci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dGZ0Y3hvY2hpcHR2aXpxbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjQyMDAsImV4cCI6MjA4NzIwMDIwMH0.lWoYhKcgXElgrEJFYc_DXi-1lql6HWMXxmGsCPXFEak';



document.addEventListener('DOMContentLoaded', function() {
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
            backToTopButton.addEventListener('click', function() {
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

function setupHeaderPopups() {
    // --- 1. VERIFICAÇÃO DE PERSISTÊNCIA (AO CARREGAR A PÁGINA) ---
    const dadosSalvos = localStorage.getItem('usuarioEcoClass');
    if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);
        
        const nameDisplay = document.getElementById('userNameDisplay');
        const pointsDisplay = document.getElementById('userPointsDisplay');
        const popupPoints = document.getElementById('popupPointsValue');
        const popupDonations = document.getElementById('popupDonationsValue');

        if (nameDisplay) nameDisplay.textContent = usuario.nome.toUpperCase();
        if (pointsDisplay) pointsDisplay.textContent = `PONTOS: ${usuario.qtd_pontos}`;
        if (popupPoints) popupPoints.textContent = usuario.qtd_pontos;
        if (popupDonations) popupDonations.textContent = usuario.doacoes || 0;
    }

    // --- 2. SELEÇÃO DE ELEMENTOS ---
    const loginInfo = document.getElementById('loginInfo');
    const loginPopup = document.getElementById('loginPopup');
    const loginForm = document.getElementById('loginForm');
    const pontuacaoNavLink = document.getElementById('pontuacaoNavLink');
    const pointsPopup = document.getElementById('pointsPopup');

    // --- 3. LÓGICA DE LOGIN ---
    if (loginInfo && loginPopup) {
        loginInfo.addEventListener('click', function(event) {
            event.stopPropagation();
            loginPopup.style.display = loginPopup.style.display === 'block' ? 'none' : 'block';
            if (pointsPopup) pointsPopup.style.display = 'none';
        });

        
        if (loginForm) {
            loginForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                const input_login = document.getElementById('login-username'); // Pode ser CPF ou CNPJ
                const mensagem = document.getElementById('loginError'); // Elemento para exibir mensagens de erro

                // 1. Criamos as variáveis fora do 'if' usando 'let'
                let cpf = null;
                let cnpj = null;

                const tamanhoInput = input_login.value.length; // Verifica o tamanho do input para determinar se é CPF ou CNPJ
                if (tamanhoInput === 14) {
                    cpf = input_login.value;
                } 
                else if (tamanhoInput === 18) {
                    cnpj = input_login.value;
                }
                else {
                    mensagem.textContent = 'Por favor, insira o CPF (14 caracteres) ou CNPJ (18 caracteres) com a pontuação.';
                    mensagem.style.display = 'block';
                    return;
                }

                // const cpf = document.getElementById('login-username').value;
                const senha = document.getElementById('login-password').value;
                const loginErrorMsg = document.getElementById('loginError');


                try {
                // 2. Montamos a consulta de forma dinâmica
                let query = _supabase
                    .from('Usuarios')
                    .select('*');

                if (cpf) {
                    query = query.eq('cpf', cpf);
                } else if (cnpj) {
                    query = query.eq('cnpj', cnpj);
                }

                const { data: usuario, error } = await query
                    .eq('senha', senha)
                    .single();

                if (error || !usuario) {
                    loginErrorMsg.textContent = 'CPF/CNPJ ou senha incorretos.';
                    loginErrorMsg.style.display = 'block';
                    return;
                }

                    // Prepara os dados para salvar
                    const dadosParaPersistir = {
                        nome: usuario.nome,
                        qtd_pontos: usuario.qtd_pontos,
                        doacoes: usuario.qtd_doacoes || 0,
                        id: usuario.id
                    };

                    // Salva no navegador para persistir entre páginas
                    localStorage.setItem('usuarioEcoClass', JSON.stringify(dadosParaPersistir));

                    console.log('Login realizado com sucesso!');
                    loginPopup.style.display = 'none';
                    
                    // Recarrega para aplicar os dados no header
                    window.location.reload(); 

                } catch (err) {
                    console.error('Erro na requisição:', err);
                    loginErrorMsg.textContent = 'Erro ao conectar com o servidor.';
                    loginErrorMsg.style.display = 'block';
                }
            });
        }
    }

    // --- 4. POPUP DE PONTUAÇÃO E FECHAMENTO CLICANDO FORA ---
    if (pontuacaoNavLink && pointsPopup) {
        pontuacaoNavLink.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            pointsPopup.style.display = pointsPopup.style.display === 'block' ? 'none' : 'block';
            if (loginPopup) loginPopup.style.display = 'none';
        });
    }

    document.addEventListener('click', function(event) {
        if (loginPopup && loginPopup.style.display === 'block' && !loginInfo.contains(event.target) && !loginPopup.contains(event.target)) {
            loginPopup.style.display = 'none';
        }
        if (pointsPopup && pointsPopup.style.display === 'block' && !pontuacaoNavLink.contains(event.target) && !pointsPopup.contains(event.target)) {
            pointsPopup.style.display = 'none';
        }
    });
}

    // Configura os links do rodapé para abrir os popups
    function setupFooterLinks() {
        const footerLoginLink = document.getElementById('footerLoginLink');
        const loginPopup = document.getElementById('loginPopup');
        const loginInfo = document.getElementById('loginInfo');
        const footerPontuacaoLink = document.getElementById('footerPontuacaoLink');
        const pointsPopup = document.getElementById('pointsPopup');

        if (footerLoginLink && loginPopup && loginInfo) {
            footerLoginLink.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                loginPopup.style.display = 'block';
                if (pointsPopup) pointsPopup.style.display = 'none';
            });
        }
        if (footerPontuacaoLink && pointsPopup && loginInfo) {
            footerPontuacaoLink.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                pointsPopup.style.display = 'block';
                if (loginPopup) loginPopup.style.display = 'none';
            });
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

    // --- LÓGICA ESPECÍFICA PARA AS PÁGINAS DE CADASTRO (DOAR) E SOLICITAÇÃO (RECEBER) ---

    // Lógica para a página de Cadastro de Material (querodoar.html)
    const materialFormContainer = document.querySelector('.doar-form-container');
    if (materialFormContainer) {
        const materialForm = document.getElementById('materialForm');
        const submitBtn = materialFormContainer.querySelector('.doar-submit-btn');

        // Lógica de validação e funcionalidade do formulário de doação
        if (submitBtn) {
            submitBtn.addEventListener('click', function(event) {
                event.preventDefault();

                const fileInput = document.getElementById('imagem');
                const categoriaSelect = document.getElementById('categoria');
                const nomeInput = document.getElementById('nome');
                const descricaoTextarea = document.getElementById('descricao');
                const pontoSelect = document.getElementById('ponto');
                const starsContainer = document.getElementById('doar-stars');
                const ratingInput = starsContainer.querySelector('input[type="hidden"]');
                
                // Clear existing validation messages
                const oldMessages = materialFormContainer.querySelectorAll('.validation-message');
                oldMessages.forEach(msg => msg.remove());

                let formIsValid = true;
                const fieldsToValidate = [
                    { element: fileInput, condition: fileInput.files.length === 0, message: 'Por favor, adicione uma imagem para o material.' },
                    { element: categoriaSelect, condition: categoriaSelect.value === 'Selecionar Opção', message: 'Por favor, selecione uma categoria.' },
                    { element: nomeInput, condition: nomeInput.value.trim() === '', message: 'Por favor, preencha o nome do material.' },
                    { element: descricaoTextarea, condition: descricaoTextarea.value.trim() === '', message: 'Por favor, preencha a descrição do material.' },
                    { element: ratingInput, condition: ratingInput.value === '0', message: 'Por favor, selecione o estado do material (estrelas).' },
                    { element: pontoSelect, condition: pontoSelect.value === 'Selecionar Opção', message: 'Por favor, selecione um ponto de entrega.' }
                ];

                fieldsToValidate.forEach(field => {
                    const targetElement = field.element;
                    if (field.condition) {
                        showValidationMessage(targetElement, field.message);
                        formIsValid = false;
                    } else {
                        targetElement.classList.remove('is-invalid');
                    }
                });

                if (formIsValid) {
                    // Start confetti animation
                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 150,
                            spread: 90,
                            origin: { y: 0.6 }
                        });
                    }

                    // Show success message and redirect
                    showSuccessMessage('Doação cadastrada com sucesso! Redirecionando...', 'EcoClass.html');
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
            fileInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
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


    // ... (código existente) ...

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
        solicitacaoForm.addEventListener('submit', function(event) {
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
            setTimeout(function() {
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
                showSuccessMessage('Cadastro realizado com sucesso!', 'EcoClass.html');
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
                showSuccessMessage('Cadastro realizado com sucesso!', 'EcoClass.html');
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

                setTimeout(() => { window.location.href = 'EcoClass.html'; }, 2000);

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