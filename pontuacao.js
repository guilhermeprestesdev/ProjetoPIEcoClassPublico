// 4. Inicialização de Eventos (Tudo dentro de UM único DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    carregarTabelaPontuacao();
});

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