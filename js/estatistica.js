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

carregarEstatisticas();