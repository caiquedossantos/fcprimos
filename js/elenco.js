
console.log("Elenco JS carregado");

//Isso faz o código rodar só depois que o HTML carregar
document.addEventListener("DOMContentLoaded", function(){
    carregarJogadores();
});

function carregarJogadores() {

     const lista = document.getElementById("listaJogadores");

     const jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];

     if (jogadores.length === 0) {
        lista.innerHTML = "<p>Nenhum Jogador Cadastrado.</p>";
        return;
     } 

     jogadores.forEach(function(jogador){

        const card = document.createElement("div");

        card.innerHTML = `
        <p><strong>Nome:<strong> ${jogador.nome}</p>
        <p><strong>Posição:<strong> ${jogador.posicao}</p>
        <p><strong>data de Nascimento:<strong> ${jogador.dataNascimento}</p>
        <hr>
     `
        ;

        lista.appendChild(card);
     });
        

}