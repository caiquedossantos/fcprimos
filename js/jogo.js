console.log("JS jogo funcionando!")

const form = document.getElementById ("formJogo");

form.addEventListener("submit",function(event){
    event.preventDefault();
    salvarJogo();
});

function salvarJogo(){
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

    const jogo = {
        liga: liga,
        adversario: adversario,
        data_jogo: data_jogo,
        gols_primos: gols_primos,
        gols_adv: gols_adv
    };

    fetch("http://localhost:5000/jogos", {
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
    .then(data => {
        console.log("Sucesso:", data);
        alert("Jogo cadastrado com sucesso!");
        form.reset();
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao cadastrar jogo");
    });
}
