// Função para carregar a lista de funcionários
async function carregarFuncionarios() {
    try {
        const response = await fetch('http://localhost:3000/api/funcionarios');
        const funcionarios = await response.json();

        const container = document.getElementById('funcionarios-container');
        container.innerHTML = '';

        funcionarios.forEach(funcionario => {
            const div = document.createElement('div');
            div.classList.add('funcionario');
            div.innerHTML = `
                <p><strong>Nome:</strong> ${funcionario.nome}</p>
                <p><strong>Função:</strong> ${funcionario.funcao}</p>
                <p><strong>Salário:</strong> R$ ${funcionario.salario.toFixed(2)}</p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        alert('Erro ao carregar a lista de funcionários.');
    }
}

// Chama a função ao carregar a página
carregarFuncionarios();