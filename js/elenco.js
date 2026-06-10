
console.log("Elenco JS carregado");

//Isso faz o código rodar só depois que o HTML carregar
document.addEventListener("DOMContentLoaded", function(){
    carregarJogadores();
});

async function carregarJogadores() {

     const lista = document.getElementById("listaJogadores");

     try {
         const response = await fetch("http://localhost:3000/jogadores");     
         const jogadores = await response.json();

         lista.innerHTML = "";

         if (jogadores.length === 0) {
            lista.innerHTML = "<p>Nenhum Jogador Cadastrado.</p>";
            return;
         }


     jogadores.forEach(function(jogador){

        const card = document.createElement("div");

        card.className = "cardJogador";

        const foto = jogador.foto 
        ? `http://localhost:3000/uploads/${jogador.foto}`
         : "https://placehold.co/220x300";  


         card.innerHTML = `
         <div class="card-frente">
               <img src="${foto}" width="180" >
               <h2>${jogador.nome_jogador}</h2>
         </div>

         <div class="card-info">
               <h2>${jogador.nome_jogador}</h2>
               <p>${jogador.posicao}</p>
               <p>${calcularIdade(jogador.data_nascimento)} anos</p>
         </div>
         `;


        lista.appendChild(card);
     });

    } catch (error) {

        console.error("Erro ao carregar jogadores:", error);

    }

}

function calcularIdade(dataNascimento) {
    const hoje = new Date();

    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade; 

}
        

