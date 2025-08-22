// script.js - Arquivo de script consolidado para todo o site

document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA GERAL PARA CARREGAR CABEÇALHO E RODAPÉ ---
    
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
                    }
                }
            })
            .catch(error => console.error(`Erro ao carregar ${url}:`, error));
    }
    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder');

    function setupFooterButton() {
        const backToTopButton = document.getElementById('backToTopBtn');
        if (backToTopButton) {
            backToTopButton.addEventListener('click', function() {
                scrollToTop(1500); 
            });
        }
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

    function setupHeaderPopups() {
        const loginInfo = document.getElementById('loginInfo');
        const loginPopup = document.getElementById('loginPopup');
        const loginForm = document.getElementById('loginForm');
        const pontuacaoNavLink = document.getElementById('pontuacaoNavLink');
        const pointsPopup = document.getElementById('pointsPopup');
        if (loginInfo && loginPopup) {
            loginInfo.addEventListener('click', function(event) {
                event.stopPropagation();
                loginPopup.style.display = loginPopup.style.display === 'block' ? 'none' : 'block';
                if (pointsPopup) pointsPopup.style.display = 'none';
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












    // --- LÓGICA ESPECÍFICA PARA A PÁGINA DE CADASTRO DE MATERIAL ---
    const materialForm = document.getElementById('materialForm');
    if (materialForm) {
        // Lógica de validação e funcionalidade do formulário de doação
        materialForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const oldMessages = materialForm.querySelectorAll('.validation-message');
            oldMessages.forEach(msg => msg.remove());
            const fileInput = document.getElementById('imagem');
            const categoriaSelect = document.getElementById('categoria');
            const nomeInput = document.getElementById('nome');
            const descricaoTextarea = document.getElementById('descricao');
            const ratingInput = document.getElementById('ratingValue');
            const pontoSelect = document.getElementById('ponto');
            const fieldsToValidate = [
                { element: fileInput, condition: fileInput.files.length === 0, message: 'Por favor, adicione uma imagem para o material.' },
                { element: categoriaSelect, condition: categoriaSelect.value === '', message: 'Por favor, selecione uma categoria.' },
                { element: nomeInput, condition: nomeInput.value.trim() === '', message: 'Por favor, preencha o nome do material.' },
                { element: descricaoTextarea, condition: descricaoTextarea.value.trim() === '', message: 'Por favor, preencha a descrição do material.' },
                { element: ratingInput, condition: ratingInput.value === '0', message: 'Por favor, selecione o estado do material (estrelas).' },
                { element: pontoSelect, condition: pontoSelect.value === '', message: 'Por favor, selecione um ponto de entrega.' }
            ];
            let formIsValid = true;
            fieldsToValidate.forEach(field => {
                if (field.condition) {
                    showValidationMessage(field.element, field.message);
                    formIsValid = false;
                }
            });
            if (formIsValid) {
                console.log('Formulário validado com sucesso! Envio para o servidor.');
                alert('Material cadastrado com sucesso!');
                materialForm.reset();
            }
        });
        function showValidationMessage(element, message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'validation-message';
            messageDiv.textContent = message;
            if (element.id === 'ratingValue') {
                const starsContainer = document.getElementById('doar-stars');
                if (starsContainer) starsContainer.insertAdjacentElement('afterend', messageDiv);
            } else {
                element.insertAdjacentElement('afterend', messageDiv);
            }
            setTimeout(() => { if (messageDiv) messageDiv.remove(); }, 4000);
        }
        const starsContainer = document.getElementById('doar-stars');
        const ratingInput = document.getElementById('ratingValue');
        if (starsContainer && ratingInput) {
            const stars = starsContainer.querySelectorAll('.doar-star');
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const value = parseInt(star.getAttribute('data-value'));
                    ratingInput.value = value;
                    stars.forEach((s, index) => {
                        if (index < value) s.classList.add('filled');
                        else s.classList.remove('filled');
                    });
                });
            });
        }
        const fileInput = document.getElementById('imagem');
        const imageUploadDiv = document.querySelector('.doar-image-upload');
        if (fileInput && imageUploadDiv) {
            const cameraIcon = document.querySelector('.doar-camera-icon');
            const uploadText = imageUploadDiv.querySelector('p');
            const uploadForm = imageUploadDiv.querySelector('form');
            function handleImagePreview(file) {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imageUploadDiv.style.backgroundImage = `url(${e.target.result})`;
                        imageUploadDiv.style.backgroundSize = 'cover';
                        imageUploadDiv.style.backgroundPosition = 'center';
                        if (cameraIcon) cameraIcon.style.display = 'none';
                        if (uploadText) uploadText.style.display = 'none';
                        if (uploadForm) uploadForm.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                } else {
                    imageUploadDiv.style.backgroundImage = 'none';
                    if (cameraIcon) cameraIcon.style.display = 'block';
                    if (uploadText) uploadText.style.display = 'block';
                    if (uploadForm) uploadForm.style.display = 'block';
                }
            }
            fileInput.addEventListener('change', function() { handleImagePreview(this.files[0]); });
            imageUploadDiv.addEventListener('click', function() { fileInput.click(); });
            imageUploadDiv.addEventListener('dragover', function(event) { event.preventDefault(); event.stopPropagation(); imageUploadDiv.classList.add('dragover'); });
            imageUploadDiv.addEventListener('dragleave', function(event) { event.preventDefault(); event.stopPropagation(); imageUploadDiv.classList.remove('dragover'); });
            imageUploadDiv.addEventListener('drop', function(event) { event.preventDefault(); event.stopPropagation(); imageUploadDiv.classList.remove('dragover'); const files = event.dataTransfer.files; if (files && files.length > 0) handleImagePreview(files[0]); });
        }
    }










    // --- LÓGICA ESPECÍFICA PARA A PÁGINA DE CADASTRO PF E PJ ---
    const formPessoaFisica = document.getElementById('formPessoaFisica');
    const formPessoaJuridica = document.getElementById('formPessoaJuridica');

    if (formPessoaFisica) {
        // Lógica de formatação e validação de PF
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
        
        // Formatação
        if (cpfInput) cpfInput.addEventListener('input', function (event) {
            let valor = event.target.value; valor = valor.replace(/\D/g, ""); valor = valor.substring(0, 11);
            if (valor.length > 9) { valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4'); } else if (valor.length > 6) { valor = valor.replace(/^(\d{3})(\d{3})(\d{3}).*/, '$1.$2.$3'); } else if (valor.length > 3) { valor = valor.replace(/^(\d{3})(\d{3}).*/, '$1.$2'); } else if (valor.length >= 1) { valor = valor.replace(/^(\d{3}).*/, '$1'); }
            event.target.value = valor;
        });
        if (contatoInput) contatoInput.addEventListener('input', function (event) {
            let valor = event.target.value; valor = valor.replace(/\D/g, ""); valor = valor.substring(0, 11);
            if (valor.length > 10) { valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3'); } else if (valor.length > 6) { valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3'); } else if (valor.length > 2) { valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2'); } else if (valor.length > 0) { valor = valor.replace(/^(\d*)/, '($1'); }
            event.target.value = valor;
        });
        if (cepInput) cepInput.addEventListener('input', function (event) {
            let valor = event.target.value; valor = valor.replace(/\D/g, ""); valor = valor.substring(0, 8);
            if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d{1,3}).*/, '$1-$2');
            event.target.value = valor;
        });
        
        // Checkbox e Visibilidade
        if (souEstudanteCheckbox && naoSouEstudanteCheckbox && formGroupEscola && formGroupNivelEscolar) {
            function gerenciarCamposEstudante() {
                if (souEstudanteCheckbox.checked) { formGroupEscola.style.display = 'block'; formGroupNivelEscolar.style.display = 'block'; }
                else { formGroupEscola.style.display = 'none'; formGroupNivelEscolar.style.display = 'none'; escolaSelect.value = ""; nivelEscolarSelect.value = ""; }
            }
            souEstudanteCheckbox.addEventListener('change', function () { if (souEstudanteCheckbox.checked) naoSouEstudanteCheckbox.checked = false; gerenciarCamposEstudante(); });
            naoSouEstudanteCheckbox.addEventListener('change', function () { if (naoSouEstudanteCheckbox.checked) souEstudanteCheckbox.checked = false; gerenciarCamposEstudante(); });
            gerenciarCamposEstudante();
        }

        // Validação
        formPessoaFisica.addEventListener('submit', function (event) {
            event.preventDefault(); let isValid = true; let errorMessage = '';
            const requiredFields = document.querySelectorAll('#formPessoaFisica input[required], #formPessoaFisica select[required]');
            for (const field of requiredFields) { if (field.value.trim() === '') { errorMessage = 'Por favor, preencha todos os campos obrigatórios.'; isValid = false; break; } }
            if (isValid && souEstudanteCheckbox.checked && (escolaSelect.value === "" || nivelEscolarSelect.value === "")) { errorMessage = 'Por favor, selecione sua Escola e Nível Escolar para continuar.'; isValid = false; }
            const senhaInput = document.getElementById('senha'); const confirmarSenhaInput = document.getElementById('confirmar-senha');
            if (isValid && senhaInput && confirmarSenhaInput) {
                if (senhaInput.value.length < 6) { errorMessage = 'A senha deve ter pelo menos 6 caracteres.'; isValid = false; }
                else if (senhaInput.value !== confirmarSenhaInput.value) { errorMessage = 'As senhas não coincidem. Por favor, verifique.'; isValid = false; }
            }
            if (isValid && !souEstudanteCheckbox.checked && !naoSouEstudanteCheckbox.checked) { errorMessage = "Por favor, selecione se você é um 'estudante' ou 'não estudante'."; isValid = false; }
            if (isValid) { alert('Formulário enviado com sucesso (simulação)!'); formPessoaFisica.reset(); }
            else { alert(errorMessage); }
        });
    }

    if (formPessoaJuridica) {
        // Lógica de formatação e validação de PJ
        const btnPessoaFisica = document.getElementById('btnPessoaFisica');
        const cnpjInput = document.getElementById('cnpj');
        const ieInput = document.getElementById('ie');
        const isentoCheckbox = document.getElementById('isento');
        const instituicaoEnsinoCheckbox = document.getElementById('instituicao-ensino');
        const empresaDoadoraCheckbox = document.getElementById('empresa-doadora');
        const codigoInepInput = document.getElementById('codigo-inep');
        const contatoInput = document.getElementById('contato');
        const cepInput = document.getElementById('cep');

        if (btnPessoaFisica) btnPessoaFisica.addEventListener('click', function () { window.location.href = 'Cad_PF.html'; });
        
        // Formatação
        if (cnpjInput) cnpjInput.addEventListener('input', function (event) {
            let valor = event.target.value; valor = valor.replace(/\D/g, ""); valor = valor.substring(0, 14);
            if (valor.length > 12) { valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5'); }
            else if (valor.length > 8) { valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4}).*/, '$1.$2.$3/$4'); }
            else if (valor.length > 5) { valor = valor.replace(/^(\d{2})(\d{3})(\d{3}).*/, '$1.$2.$3'); }
            else if (valor.length > 2) { valor = valor.replace(/^(\d{2})(\d{3}).*/, '$1.$2'); }
            event.target.value = valor;
        });
        if (contatoInput) contatoInput.addEventListener('input', function (event) {
            let valor = event.target.value; valor = valor.replace(/\D/g, ""); valor = valor.substring(0, 11);
            if (valor.length > 10) { valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3'); }
            else if (valor.length > 6) { valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3'); }
            else if (valor.length > 2) { valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2'); }
            else if (valor.length > 0) { valor = valor.replace(/^(\d*)/, '($1'); }
            event.target.value = valor;
        });
        if (cepInput) cepInput.addEventListener('input', function (event) {
            let valor = event.target.value; valor = valor.replace(/\D/g, ""); valor = valor.substring(0, 8);
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
            isentoCheckbox.addEventListener('change', function () { if (ieInput.value.trim() === "" && !isentoCheckbox.checked) isentoCheckbox.checked = true; });
        }
        
        // Checkbox e Visibilidade
        if (instituicaoEnsinoCheckbox && empresaDoadoraCheckbox && codigoInepInput) {
            function gerenciarTipoEntidade() {
                if (instituicaoEnsinoCheckbox.checked) {
                    empresaDoadoraCheckbox.checked = false;
                    codigoInepInput.style.display = 'block';
                    codigoInepInput.focus();
                } else if (empresaDoadoraCheckbox.checked) {
                    instituicaoEnsinoCheckbox.checked = false;
                    codigoInepInput.style.display = 'none';
                    codigoInepInput.value = '';
                } else {
                    codigoInepInput.style.display = 'none';
                    codigoInepInput.value = '';
                }
            }
            instituicaoEnsinoCheckbox.addEventListener('change', gerenciarTipoEntidade);
            empresaDoadoraCheckbox.addEventListener('change', gerenciarTipoEntidade);
            gerenciarTipoEntidade();
        }

        // Validação
        formPessoaJuridica.addEventListener('submit', function (event) {
            event.preventDefault(); let isValid = true; let errorMessage = '';
            const requiredFields = document.querySelectorAll('#formPessoaJuridica input[required], #formPessoaJuridica select[required]');
            for (const field of requiredFields) {
                if (field.value.trim() === '' && !(field.id === 'ie' && isentoCheckbox.checked)) { // IE is optional if "isento" is checked
                    errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
                    isValid = false;
                    break;
                }
            }
            // Validação da Inscrição Estadual e Isenção no submit
            const valorIE = ieInput.value.trim();
            if (isValid && valorIE === "" && !isentoCheckbox.checked) {
                errorMessage = "Para concluir, você deve preencher a Inscrição Estadual ou marcar a opção 'Sou ISENTO'.";
                isValid = false;
            }
            if (isValid && !instituicaoEnsinoCheckbox.checked && !empresaDoadoraCheckbox.checked) {
                errorMessage = "Por favor, selecione se você é uma 'Instituição de ensino' ou uma 'Empresa doadora'.";
                isValid = false;
            }
            if (isValid && instituicaoEnsinoCheckbox.checked && codigoInepInput.value.trim().length !== 8) {
                errorMessage = "Por favor, digite um Código INEP válido com 8 dígitos.";
                isValid = false;
            }
            const senhaInput = document.getElementById('senha'); const confirmarSenhaInput = document.getElementById('confirmar-senha');
            if (isValid && senhaInput && confirmarSenhaInput) {
                if (senhaInput.value.length < 6) { errorMessage = 'A senha deve ter pelo menos 6 caracteres.'; isValid = false; }
                else if (senhaInput.value !== confirmarSenhaInput.value) { errorMessage = 'As senhas não coincidem. Por favor, verifique.'; isValid = false; }
            }
            if (isValid) { alert('Formulário enviado com sucesso (simulação)!'); formPessoaJuridica.reset(); }
            else { alert(errorMessage); }
        });
    }
});


// Trecho do seu script.js
// Lógica para o sistema de avaliação por estrelas
const starsContainer = document.getElementById('doar-stars');

if (starsContainer) {
    const stars = starsContainer.querySelectorAll('.doar-star');
    const ratingInput = document.getElementById('ratingValue'); // O input hidden que guarda o valor

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            if (ratingInput) {
                ratingInput.value = value; // Atualiza o valor do input hidden
            }

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


















