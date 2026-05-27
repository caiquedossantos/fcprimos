function mostrarMensagem(){
    alert("Javscript está funcionando!")
}

async function listarJogadores() {
    const response = await fetch("http://localhost:3000/jogadores");
    const jogadores = await response.json();

    renderizarJogadores(jogadores);
}

function renderizarJogadores(jogadores){
    const lista = document.getElementById("listaJogadores");
    lista.innerHTML = "";

    jogadores.forEach(jogador => {
        const item = document.createElement("li");

        item.innerHTML = `
            ${jogador.nome_jogador} - ${jogador.posicao}

            <button onclick="editarJogador(${jogador.id_jogador})">Editar</button>
            <button onclick="deletarJogador(${jogador.id_jogador})">Excluir</button>
        `;

        lista.appendChild(item);
    });
}

async function deletarJogador(id) {
    await fetch (`http://localhost:3000/jogadores/${id}`,{
        method: "DELETE"
    });

    listarJogadores();
    
}

async function editarJogador(id) {
    const nome = prompt ("Novo nome: ");
    const posicao = prompt ("Nova posição: ");
    const data_nascimento = prompt ("Nova data: ");

    await fetch (`http://localhost:3000/jogadores/${id}`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"    
        },
        body: JSON.stringify({
            nome_jogador: nome,
            posicao: posicao,
            data_nascimento: data_nascimento
        })
    });

    listarJogadores();
    
}

window.onload = function(){
    listarJogadores();
}