async function carregarEstatisticas() {
    try {
        const response = await fetch("http://localhost:3000/estatisticas");
        const dados = await response.json();
        console.log("Dados de estatísticas:", dados);

        document.getElementById("totalJogos").textContent = dados.totalJogos;

        document.getElementById("totalVitorias").textContent = dados.vitorias;

        document.getElementById("totalEmpates").textContent = dados.empates; 

        document.getElementById("totalDerrotas").textContent = dados.derrotas;

        document.getElementById("totalGolsMarcados").textContent = dados.golsMarcados;

        document.getElementById("totalGolsSofridos").textContent = dados.golsSofridos;
    
    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
}



async function carregarEstatisticasJogadores(){
    try {
        const response = await fetch("http://localhost:3000/estatisticas-jogadores");
        const jogadores = await response.json();

        const tbody = document.getElementById("listaEstatisticasJogadores");
        
        tbody.innerHTML = "";

        jogadores.forEach(jogador => {
            tbody.innerHTML += `
                <tr>
                    <td>${jogador.nome_jogador}</td>
                    <td>${jogador.posicao}</td>
                    <td>${jogador.jogos}</td>
                    <td>${jogador.gols}</td>
                    <td>${jogador.assistencias}</td>
                    <td>${jogador.amarelos}</td>
                    <td>${jogador.vermelhos}</td>
                </tr>
            `;
        });
        
        

    } catch (error) {
        console.error("Erro ao carregar estatísticas dos jogadores:", error);
    }
}

carregarEstatisticas();
carregarEstatisticasJogadores();