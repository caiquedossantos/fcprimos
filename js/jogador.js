console.log("JS está funcionando!");

const form = document.getElementById("formJogador");

form.addEventListener("submit",function(event){
    event.preventDefault();
    salvarJogador();
});

function salvarJogador(){
    const nome = document.getElementById("nome").value;
    const dataNasc = document.getElementById("dataNasc").value;
    const posicao = document.getElementById("posicao").value;

    const foto = document.getElementById("foto").files[0];
    const documento = document.getElementById("documento").files[0];
    


const Jogador = {
    nome: nome,
    dataNascimento: dataNasc,
    posicao: posicao,
    fotoNome: foto ? foto.name : null,
    documentoNome: documento ? documento.name : null
};

salvarNoLocalStorage(Jogador);

alert("Jogador Cadastrado com sucesso!")
form.reset();

}

function salvarNoLocalStorage(Jogador){
    let jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];

    jogadores.push(Jogador);

    localStorage.setItem("jogadores", JSON.stringify(jogadores));
}