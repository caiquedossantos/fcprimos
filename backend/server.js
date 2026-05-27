const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./db");

const app = express();


// =========================
// CONFIGURAÇÃO DO MULTER
// =========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({

    storage,

    fileFilter: (req, file, cb) => {

        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg"
        ) {

            cb(null, true);

        } else {

            cb(new Error("Arquivo inválido! Apenas imagens PNG/JPG"));

        }

    }

});


// =========================
// MIDDLEWARES
// =========================

app.use(cors());

app.use(express.json());

// libera acesso às imagens
app.use("/uploads", express.static("uploads"));


// =========================
// TESTE API
// =========================

app.get("/", (req, res) => {

    res.send("Servidor PRIMOSFC funcionando!");

});


// ======================================================
// JOGADORES
// ======================================================


// =========================
// GET TODOS JOGADORES
// =========================

app.get("/jogadores", (req, res) => {

    const sql = "SELECT * FROM jogador";

    db.query(sql, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                erro: "Erro ao buscar jogadores"
            });

        }

        res.json(result);

    });

});


// =========================
// GET JOGADOR POR ID
// =========================

app.get("/jogadores/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
    SELECT * 
    FROM jogador 
    WHERE id_jogador = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                erro: "Erro ao buscar jogador"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                mensagem: "Jogador não encontrado"
            });

        }

        res.json(result[0]);

    });

});


// =========================
// CADASTRAR JOGADOR
// =========================

app.post("/jogadores", upload.single("foto"), (req, res) => {

    const {
        nome_jogador,
        posicao,
        data_nascimento
    } = req.body;

    const foto = req.file ? req.file.filename : null;

    const sql = `
    INSERT INTO jogador
    (
        nome_jogador,
        posicao,
        data_nascimento,
        foto
    )
    VALUES (?,?,?,?)
    `;

    db.query(
        sql,
        [
            nome_jogador,
            posicao,
            data_nascimento,
            foto
        ],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    erro: "Erro ao cadastrar jogador"
                });

            }

            res.json({
                mensagem: "Jogador cadastrado com sucesso!",
                id: result.insertId
            });

        }
    );

});


// =========================
// ATUALIZAR JOGADOR
// =========================

app.put("/jogadores/:id", (req, res) => {

    const id = req.params.id;

    const {
        nome_jogador,
        posicao,
        data_nascimento
    } = req.body;

    const sql = `
    UPDATE jogador
    SET
        nome_jogador = ?,
        posicao = ?,
        data_nascimento = ?
    WHERE id_jogador = ?
    `;

    db.query(
        sql,
        [
            nome_jogador,
            posicao,
            data_nascimento,
            id
        ],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    erro: "Erro ao atualizar jogador"
                });

            }

            res.json({
                mensagem: "Jogador atualizado com sucesso!"
            });

        }
    );

});


// =========================
// ATUALIZAR FOTO
// =========================

app.post("/upload-foto/:id", upload.single("foto"), (req, res) => {

    const id = req.params.id;

    const foto = req.file ? req.file.filename : null;

    const sql = `
    UPDATE jogador
    SET foto = ?
    WHERE id_jogador = ?
    `;

    db.query(sql, [foto, id], (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                erro: "Erro ao salvar foto"
            });

        }

        res.json({
            mensagem: "Foto salva com sucesso!"
        });

    });

});


// =========================
// DELETAR JOGADOR
// =========================

app.delete("/jogadores/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
    DELETE FROM jogador
    WHERE id_jogador = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                erro: "Erro ao deletar jogador"
            });

        }

        res.json({
            mensagem: "Jogador deletado com sucesso!"
        });

    });

});


// ======================================================
// JOGOS
// ======================================================


// =========================
// LISTAR JOGOS
// =========================

app.get("/jogos", (req, res) => {

    const sql = `
    SELECT *
    FROM jogo
    ORDER BY data_jogo DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                erro: "Erro ao buscar jogos"
            });

        }

        res.json(result);

    });

});


// =========================
// CADASTRAR JOGO
// =========================

app.post("/jogos", (req, res) => {

    const {
        liga,
        adversario,
        data_jogo,
        gols_primos,
        gols_adv
    } = req.body;

    const sql = `
    INSERT INTO jogo
    (
        liga,
        adversario,
        data_jogo,
        gols_primos,
        gols_adv
    )
    VALUES (?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            liga,
            adversario,
            data_jogo,
            gols_primos,
            gols_adv
        ],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    erro: "Erro ao cadastrar jogo"
                });

            }

            res.json({
                mensagem: "Jogo cadastrado com sucesso!",
                id: result.insertId
            });

        }
    );

});


// ======================================================
// INICIAR SERVIDOR
// ======================================================

app.listen(3000, () => {

    console.log("Servidor rodando na porta 3000");

});