// Inicializa com os dados da Session Storage (Se tiver)
function verificarAcesso() {
    const dados = localStorage.getItem('usuarioEcoClass');

    // if (!dados) {
    //     // Se não tem dado, manda de volta para o index
    //     alert("Acesso negado! Faça login.");
    //     window.location.href = 'index.html';
    //     return;
    // }

    const usuario = JSON.parse(dados);
    // Agora você pode usar o ID do usuário para buscar doações no Supabase
    const usuarioId = usuario.id;
    return usuarioId; // Retorna o ID do usuário para ser usado em outras funções, se necessário
}
verificarAcesso(); // Verifica o acesso do usuário (E redireciona se não tiver acesso)
// Inicialização de Eventos (Tudo dentro de UM único DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
        
    carregarPontuacaoEDoacoes();
    carregarTabelaPontuacao();
    
});

//Carrega a pontuação e doações do usuário logado na página de header e retornar os dados na pagina de pontuação
async function carregarPontuacaoEDoacoes() {
  
    try {
       
        const usuarioId = verificarAcesso(); // Obtém o ID do usuário logado
        const { data: usuario, error } = await _supabase
            .from('Usuarios')
            .select('qtd_pontos, qtd_doacoes')
            .eq('id', usuarioId)
            .single();

        if (error) throw error;

        const { qtd_pontos, qtd_doacoes } = usuario || {};
        // Informa as qtd_pontos e qtd_doacoes nos campos pagePointsValue e pageDonationsValue
        document.getElementById('pagePointsValue').textContent = `${qtd_pontos}`;
        document.getElementById('pageDonationsValue').textContent = `${qtd_doacoes}`;

    } catch (err) {
        console.error("Erro ao carregar pontuação e doações:", err.message);
    }
}



// Função para buscar e preencher a tabela de pontuação
async function carregarTabelaPontuacao() {
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

// Função para inativar a categoria (Com trava de segurança)
async function inativarCategoria(idCategoria) {
    try {
        // 1. VERIFICAÇÃO DE SEGURANÇA: Checa se há doações pendentes
        const { data: doacoesAtivas, error: erroVerificacao } = await _supabase
            .from('Doacao')
            .select('id') // Trazemos só o ID para economizar dados
            .eq('disponivel', true)
            .eq('x_id_categoria', idCategoria)
            .limit(1); // O limit(1) deixa a busca super rápida, pois para assim que acha a primeira

        if (erroVerificacao) throw erroVerificacao;

        // Se o array voltar com tamanho maior que 0, significa que existe doação pendente!
        if (doacoesAtivas && doacoesAtivas.length > 0) {
            alert("⚠️ Bloqueado: Não é possível inativar esta categoria, pois existem doações pendentes vinculadas a ela.");
            return; // Interrompe a função aqui e não faz a inativação
        }

        // 2. CONFIRMAÇÃO DO USUÁRIO
        // (Só chega aqui se a categoria estiver livre de doações)
        const confirmacao = confirm("Tem certeza que deseja inativar esta categoria?");
        if (!confirmacao) return;

        // 3. EXECUÇÃO DA INATIVAÇÃO
        const { error: erroInativacao } = await _supabase
            .from('Pontuacao')
            .update({ status: false }) // Altera o status para inativo
            .eq('id', idCategoria);

        if (erroInativacao) throw erroInativacao;

        // Avisa que deu certo
        alert("Categoria inativada com sucesso!");

        // Recarrega a tabela para que o item inativado suma da tela
        carregarTabelaPontuacao();

        // Atualiza o Dropdown se a função existir
        if (typeof carregarCategoriasDropdown === 'function') {
            carregarCategoriasDropdown();
        }

    } catch (err) {
        console.error("Erro na tentativa de inativar categoria:", err.message);
        alert("Erro no processo: " + err.message);
    }
}



// --- LÓGICA PARA ADICIONAR NOVA CATEGORIA ---

document.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.getElementById('btn-add-categoria');
    const modal = document.getElementById('modalAddCategoria');
    const btnClose = document.getElementById('closeAddCategoria');
    const form = document.getElementById('formNovaCategoria');

    // 1. Abrir o Modal
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    // 2. Fechar o Modal
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.style.display = 'none';
            form.reset();
        });
    }

    // 3. Enviar para o Supabase (Através do clique no botão)
    const btnSalvar = document.querySelector('.cad-category-submit-btn');

    if (btnSalvar) {
        btnSalvar.addEventListener('click', async (e) => {
            e.preventDefault(); // Impede que o type="submit" recarregue a página

            // Captura os valores dos campos
            const nome = document.getElementById('new-cat-nome').value.trim();
            const desc = document.getElementById('new-cat-desc').value.trim();
            const min = document.getElementById('new-cat-min').value;
            const max = document.getElementById('new-cat-max').value;

            // Validação manual: Checa se tem algum campo vazio
            if (!nome || !desc || !min || !max) {
                alert("Por favor, preencha todos os campos antes de salvar a categoria.");
                return; // Para a execução aqui se faltar algo
            }

            // Muda o visual do botão
            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;

            const novaCategoria = {
                categoria: nome,
                descricao: desc,
                pont_min: parseInt(min),
                pont_max: parseInt(max),
                status: true // Define como ativa por padrão
            };

            try {
                const { error } = await _supabase
                    .from('Pontuacao')
                    .insert([novaCategoria]);

                if (error) throw error;

                alert("Sucesso! Categoria adicionada.");

                // Limpa e fecha o modal
                if (modal) modal.style.display = 'none';
                if (form) form.reset();

                // Recarrega a tabela para exibir a nova categoria
                if (typeof carregarTabelaPontuacao === 'function') carregarTabelaPontuacao();

                // Se tiver dropdown na página, atualiza também
                if (typeof carregarCategoriasDropdown === 'function') carregarCategoriasDropdown();

            } catch (err) {
                console.error("Erro ao inserir categoria:", err.message);
                alert("Erro ao salvar: " + err.message);
            } finally {
                // Restaura o botão
                btnSalvar.innerText = "Salvar Categoria";
                btnSalvar.disabled = false;
            }
        });
    }
});