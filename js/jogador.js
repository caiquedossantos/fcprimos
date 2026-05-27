console.log("JS está funcionando!");

const form = document.getElementById("formJogador");

form.addEventListener("submit",function(event){
    event.preventDefault();
    salvarJogador();
});
function salvarJogador(){

    const nome = document.getElementById("nome").value;
    const data_nascimento = document.getElementById("data_nascimento").value;
    const posicao = document.getElementById("posicao").value;

    const foto = document.getElementById("foto").files[0];

    const formData = new FormData();

    formData.append("nome_jogador", nome);
    formData.append("posicao", posicao);
    formData.append("data_nascimento", data_nascimento);

    if (foto) {
        formData.append("foto", foto);
    }

    fetch("http://localhost:3000/jogadores", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert("Jogador cadastrado com sucesso!");
        form.reset();
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao cadastrar jogador");
    });
}

// function salvarNoLocalStorage(Jogador){
//     let jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];

//     jogadores.push(Jogador);

//     localStorage.setItem("jogadores", JSON.stringify(jogadores));
// }