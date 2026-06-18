console.log("historico_jogos carregado");


async function carregarHistoricoJogos() {
    try {
        const response = await fetch("http://localhost:3000/jogos");

        const jogos = await response.json();

        const lista = document.getElementById("listaJogos");

        lista.innerHTML = "";

        jogos.forEach(jogo => {

            lista.innerHTML += `
                <div class="card-jogo">
                    <h3>${jogo.gols_primos} x ${jogo.gols_adv}</h3>
                    <p>
                        Primos FC x
                        ${jogo.adversario} 
                    </p>
                    
                    <p>
                        ${jogo.data_jogo}
                    </p>

                </div>
            `;
        });

    } catch (error) {

        console.error("Erro ao carregar histórico de jogos:", error);
    }   


}

carregarHistoricoJogos()
