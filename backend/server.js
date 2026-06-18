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

// =========================
// ESTATISTICAS
// =========================

app.get("/estatisticas", (req, res) => {

    const sql = `  SELECT
                       COUNT(*) AS totalJogos,
                       SUM(
                       CASE
                            WHEN gols_primos > gols_adv THEN 1
                            ELSE 0
                       END
                       ) AS vitorias,
                       SUM(
                       CASE
                            WHEN gols_primos = gols_adv THEN 1
                            ELSE 0
                       END
                       ) AS empates,
                       SUM(
                       CASE
                            WHEN gols_primos < gols_adv THEN 1
                            ELSE 0
                       END
                       ) AS derrotas,
                       SUM(gols_primos) AS golsMarcados,
                       SUM(gols_adv) AS golsSofridos
                   FROM jogo`;

    db.query(sql, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                erro: "Erro ao buscar estatísticas"
            });

        }

        res.json(result[0]);

    });

});


app.post("/gols", (req, res) => {

    const {
        jogo_id_jogo,
        jogador_id_jogador,
    }= req.body;

    const sql = `
    INSERT INTO gols
    (
        jogo_id_jogo,
        jogador_id_jogador
    )
    VALUES (?,?)
    `;

    db.query(
        sql,
        [
            jogo_id_jogo,
            jogador_id_jogador
        ],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    erro: "Erro ao cadastrar gol"
                });

            }

            res.json({
                mensagem: "Gol cadastrado com sucesso!",
                id: result.insertId
            });

        }
    );

});


app.post("/assistencias", (req, res) => {

    const {
        jogo_id_jogo,
        jogador_id_jogador,
    }= req.body;    

    const sql = `
    INSERT INTO assistencia
    (
        jogo_id_jogo,
        jogador_id_jogador
    )
    VALUES (?,?)
    `;
    db.query(   
        sql,
        [
            jogo_id_jogo,
            jogador_id_jogador
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao cadastrar assistência"
                });
            }
            res.json({
                mensagem: "Assistência cadastrada com sucesso!",
                id: result.insertId
            });

        }
    );

});

app.post("/cartoes", (req, res) => {

    const {
        tipo,
        jogo_id_jogo,
        jogador_id_jogador
    } = req.body;

    const sql = `
    INSERT INTO cartoes
    (
        tipo,
        jogo_id_jogo,
        jogador_id_jogador
    )
    VALUES (?,?,?)
    `;

    db.query(
        sql,
        [
            tipo,
            jogo_id_jogo,
            jogador_id_jogador
        ],
        (err, result) => {

            if(err){
                return res.status(500).json({
                    erro: "Erro ao cadastrar cartão"
                });
            }

            res.json({
                mensagem: "Cartão cadastrado!"
            });

        }
    );

});

app.post("/participacao", (req, res) => {

    const {
        jogo_id_jogo,
        jogador_id_jogador,
    } = req.body;

    const sql = `
    INSERT INTO participacao_jogo
    (
        jogo_id_jogo,
        jogador_id_jogador
    )
    VALUES (?,?)
    `;
    db.query(
        sql,
        [ 
            jogo_id_jogo,
            jogador_id_jogador
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({   
                    erro: "Erro ao cadastrar participação"
                });
            }
            res.json({
                mensagem: "Participação cadastrada com sucesso!",
                id: result.insertId
            });
        }   
    );
});    


app.get("/estatisticas-jogadores", (req, res) => {

    const sql = `
    SELECT
        j.id_jogador,
        j.nome_jogador,
        j.posicao,

        COUNT(DISTINCT p.id_participacao) AS jogos,

        COUNT(DISTINCT g.id_gol) AS gols,

        COUNT(DISTINCT a.id_assistencia) AS assistencias,

        SUM(
            CASE
                WHEN c.tipo = 'Amarelo'
                THEN 1
                ELSE 0
            END
        ) AS amarelos,

        SUM(
            CASE
                WHEN c.tipo = 'Vermelho'
                THEN 1
                ELSE 0
            END
        ) AS vermelhos

    FROM jogador j

    LEFT JOIN participacao_jogo p
        ON p.jogador_id_jogador = j.id_jogador

    LEFT JOIN gols g
        ON g.jogador_id_jogador = j.id_jogador

    LEFT JOIN assistencia a
        ON a.jogador_id_jogador = j.id_jogador

    LEFT JOIN cartoes c
        ON c.jogador_id_jogador = j.id_jogador

    GROUP BY
        j.id_jogador,
        j.nome_jogador,
        j.posicao

    ORDER BY gols DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                erro: "Erro ao buscar estatísticas"
            });

        }

        res.json(result);

    });

});

app.get("/jogos", (req, res) => {

    const sql = `
    SELECT *
    from jogo
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


// ======================================================
// INICIAR SERVIDOR
// ======================================================

app.listen(3000, () => {

    console.log("Servidor rodando na porta 3000");

});