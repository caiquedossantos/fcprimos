
console.log("JS jogo funcionando!")

const form = document.getElementById ("formJogo");

console.log(form);

carregarJogadores();

// form.addEventListener("submit",function(event){
//     event.preventDefault();
//     salvarJogo();
// });

console.log("1");


console.log("2");

carregarJogadores();

console.log("3");

form.addEventListener("submit", function(event){
    console.log("CLICOU");
    event.preventDefault();
    salvarJogo();
});

console.log("4");

function salvarJogo(){

    console.log("ENTROU NO SALVAR JOGO");

    const liga = document.getElementById("liga").value;
    const adversario = document.getElementById("adversario").value;
    const data_jogo = document.getElementById("data_jogo").value;
    const gols_primos = document.getElementById("gols_primos").value;
    const gols_adv = document.getElementById("gols_adv").value; 
 

     //  Validação simples
    if(!liga || !adversario || !data_jogo){
        alert("Preencha todos os campos!");
        return;
    }

    if (gols_primos < 0) {
    alert("Os gols do Primos FC não podem ser negativos.");
    return;
}

if (gols_adv < 0) {
    alert("Os gols do adversário não podem ser negativos.");
    return;
}

    const jogo = {
        liga: liga,
        adversario: adversario,
        data_jogo: data_jogo,
        gols_primos: gols_primos,
        gols_adv: gols_adv
    };

    fetch("http://localhost:3000/jogos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jogo)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao salvar jogo: " + response.status);
        }
        return response.json();
    })
    .then(async data => {
        console.log("Sucesso:", data);

        const jogoId = data.id; // Supondo que o ID do jogo seja retornado

        const jogou = document.getElementById(`jogou_${jogador.id_jogador}`).checked;
        
        if (jogou) {

            console.log("VAI SALVAR PARTICIPAÇÃO");


            await fetch("http://localhost:3000/participacao", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({
                    jogo_id_jogo: jogoId,
                    jogador_id_jogador: jogador.id_jogador
                })
            }
        );
        }


        console.log("PASSOU 2", jogoId);

        const response = await fetch(`http://localhost:3000/jogadores`);
        const jogadores = await response.json();
        console.log("PASSOU 3", jogadores);

        for (const jogador of jogadores) {

        console.log("PASSOU 1");

            const gols = parseInt(document.getElementById(`gols_${jogador.id_jogador}`).value) || 0;
            for (let i = 0; i < gols; i++) {
                await fetch("http://localhost:3000/gols", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        jogo_id_jogo: jogoId,
                        jogador_id_jogador: jogador.id_jogador
                    })
                });
            }

         // =========================
        // ASSISTÊNCIAS
        // =========================

        const assistencias = parseInt(
            document.getElementById(
                `assistencias_${jogador.id_jogador}`
            ).value
        );

        for (let i = 0; i < assistencias; i++) {

            await fetch("http://localhost:3000/assistencias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    jogo_id_jogo: jogoId,
                    jogador_id_jogador: jogador.id_jogador
                })
            });

        }

        // =========================
        // CARTÃO AMARELO
        // =========================

        if (
            document.getElementById(
                `amarelo_${jogador.id_jogador}`
            ).checked
        ) {

            await fetch("http://localhost:3000/cartoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tipo: "Amarelo",
                    jogo_id_jogo: jogoId,
                    jogador_id_jogador: jogador.id_jogador
                })
            });

        }

        // =========================
        // CARTÃO VERMELHO
        // =========================

        if (
            document.getElementById(
                `vermelho_${jogador.id_jogador}`
            ).checked
        ) {

            await fetch("http://localhost:3000/cartoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tipo: "Vermelho",
                    jogo_id_jogo: jogoId,
                    jogador_id_jogador: jogador.id_jogador
                })
            });

        }

    }

        alert("Jogo cadastrado com sucesso!");
        form.reset();
})
    .catch(error => {
        console.error(error);
        alert(error.message);
    });

}



async function carregarJogadores() {
    try {
        const response = await fetch("http://localhost:3000/jogadores");    
        const jogadores = await response.json();
        const tbody  = document.getElementById("listaJogadores");
        tbody.innerHTML = ""; // Limpa a lista antes de adicionar os jogadores

        jogadores.forEach(jogador => {

            tbody.innerHTML += `
                <tr>
                    <td>${jogador.nome_jogador}</td>    
                    <td>${jogador.posicao}</td>

                   <td><input type="checkbox" id="jogou_${jogador.id_jogador}"></td>

<td><input
    type="number"
    id="gols_${jogador.id_jogador}"
    min="0"
    value="0">
</td>

<td><input
    type="number"
    id="assistencias_${jogador.id_jogador}"
    min="0"
    value="0">
</td>

<td><input
    type="checkbox"
    id="amarelo_${jogador.id_jogador}">
</td>

<td><input
    type="checkbox"
    id="vermelho_${jogador.id_jogador}">
</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Erro ao carregar jogadores:", error);
    }

}

    // =========================

