const express = require("express");//framework para criar api
const cors = require("cors");// ligar front e back
const db = require("./db");

const app = express();// cria o servidor

app.use(cors());
app.use(express.json());// o sevidor entende a informação do JSON

app.get("/", (req, res)=> {
    res.send("Servidor PrimosFC funcionando!")
});

// GET jogadores do banco
app.get("/jogadores", (req, res)  => {

    const sql = "SELECT * FROM jogador";

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Erro ao buscar jogadores:", err);
            return res.status(500).json({ erro: "Erro ao buscar jogadores" });
        }

        return res.json(result);

    });

});

// inserir novos jogadores
app.post("/jogadores",(req, res)=>{
    const {nome_jogador, posicao, data_nascimento} = req.body;

    const sql = `
    INSERT INTO jogador (nome_jogador, posicao, data_nascimento)
    VALUES(?,?,?)
    `;

    db.query(sql, [nome_jogador,posicao,data_nascimento], (err,result) =>{
        if(err){
            console.error(err);
            return res.status(500).json({erro: "Erro ao salvar jogador"});
        }

        res.json({
            mensagem: "Jogador cadastrado com sucesso",
            id:result.insertId
        });
    });
});

// buscar jogador por id
app.get("/jogadores/:id", (req, res) => {
   
    const id = req.params.id;

    console.log("ID recebido:", id);

    const sql = "SELECT * FROM jogador WHERE id_jogador = ?";

    db.query(sql,[id],(err,result)=>{

        console.log("Resultado do banco:", result);

        if (err) {
            console.error("Erro SQL:", err);
            return res.status(500).json({erro: "Erro ao buscar jogador" });
        }

        if (result.length === 0 ) {
            return res.status(404).json({mensagem: "Jogador não encontrado"});
        }

        res.json(result[0]);
    });
});

//atualizar jogador
app.put("/jogadores/:id", (req, res) => {

    const id = req.params.id;

    const { nome_jogador, posicao, data_nascimento } = req.body;

    const sql = `
    UPDATE jogador
    SET nome_jogador = ?,
        posicao = ?,
        data_nascimento = ?
    WHERE id_jogador = ?
    `;

    db.query(sql, [nome_jogador, posicao, data_nascimento, id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao atualizar jogador" });
        }

        return res.json({ mensagem: "Jogador atualizado com sucesso!" });

    });
});

//deletar jogador
app.delete("/jogadores/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM jogador WHERE Id_Jogador = ?";

    db.query(sql,[id],(err,result)=> {
        if (err) {
            console.error(err);
            return res.status(500).json({erro: "Erro ao deletar jogador" });
        }

        res.json ({mensagem: "Jogador deletado com sucesso!"})


    });


});



//iniciar servidor
app.listen(3000,() =>{
    console.log("Servidor rodando na porta 3000")
});