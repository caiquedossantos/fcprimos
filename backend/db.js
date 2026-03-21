const mysql = require("mysql2");


//cria conexao com o banco
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"#Caiqu3123$",
    database:"primosfc"
})

console.log("Banco conectado:", connection.config.database);


//testar conexão

connection.connect((err)=> {
    if (err){
        console.error("Erro ao conectar no banco:",err);
        return;
    }

    console.log("Conectado ao MySQL!");

});
module.exports = connection;