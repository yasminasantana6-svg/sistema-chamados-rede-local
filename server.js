const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log("Iniciando servidor...");

// Conexão com MySQL
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "chamados_db"
});

// Teste de conexão
conexao.connect((erro) => {

    console.log("Tentando conectar ao MySQL...");

    if (erro) {
        console.error("ERRO AO CONECTAR:");
        console.error(erro);
        return;
    }

    console.log("MySQL conectado com sucesso!");
});

// =========================
// ROTA INICIAL
// =========================

app.get("/", (req, res) => {

    console.log("Acessou a rota /");

    res.json({
        mensagem: "API do Sistema de Chamados funcionando!"
    });

});

// =========================
// CADASTRAR CHAMADO
// =========================

app.post("/chamados", (req, res) => {

    console.log("Recebeu POST /chamados");

    const {
        nome,
        setor,
        solicitacao
    } = req.body;

    console.log("Dados recebidos:");
    console.log(req.body);

    if (!nome || !setor || !solicitacao) {

        console.log("Campos vazios.");

        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const sql =
        "INSERT INTO chamados (nome, setor, solicitacao) VALUES (?, ?, ?)";

    console.log("Executando INSERT...");

    conexao.query(
        sql,
        [nome, setor, solicitacao],
        (erro, resultado) => {

            if (erro) {

                console.log("ERRO NO INSERT:");
                console.error(erro);

                return res.status(500).json({
                    erro: erro.message
                });
            }

            console.log("Chamado cadastrado!");
            console.log(resultado);

            res.status(201).json({
                mensagem: "Chamado cadastrado com sucesso!",
                id: resultado.insertId
            });
        }
    );
});

// =========================
// LISTAR CHAMADOS
// =========================

app.get("/chamados", (req, res) => {

    console.log("=================================");
    console.log("Entrou na rota GET /chamados");
    console.log("=================================");

    const sql = "SELECT * FROM chamados";

    console.log("Executando query:");
    console.log(sql);

    conexao.query(sql, (erro, resultados) => {

        console.log("Callback da query executado");

        if (erro) {

            console.log("ERRO NA CONSULTA:");
            console.error(erro);

            return res.status(500).json({
                erro: erro.message
            });
        }

        console.log("Consulta executada com sucesso");
        console.log("Quantidade de registros:",
            resultados.length);

        console.log("Resultados:");
        console.log(resultados);

        res.json(resultados);
    });
});

// =========================
// BUSCAR POR ID
// =========================

app.get("/chamados/:id", (req, res) => {

    const { id } = req.params;

    console.log(`Buscando chamado ${id}`);

    const sql =
        "SELECT * FROM chamados WHERE id = ?";

    conexao.query(
        sql,
        [id],
        (erro, resultados) => {

            if (erro) {

                console.log("Erro ao buscar chamado:");
                console.error(erro);

                return res.status(500).json({
                    erro: erro.message
                });
            }

            if (resultados.length === 0) {

                console.log("Chamado não encontrado.");

                return res.status(404).json({
                    erro: "Chamado não encontrado."
                });
            }

            console.log("Chamado encontrado.");

            res.json(resultados[0]);
        }
    );
});

// =========================
// EXCLUIR
// =========================

app.delete("/chamados/:id", (req, res) => {

    const { id } = req.params;

    console.log(`Excluindo chamado ${id}`);

    const sql =
        "DELETE FROM chamados WHERE id = ?";

    conexao.query(
        sql,
        [id],
        (erro) => {

            if (erro) {

                console.log("Erro ao excluir:");
                console.error(erro);

                return res.status(500).json({
                    erro: erro.message
                });
            }

            console.log("Chamado removido.");

            res.json({
                mensagem: "Chamado removido com sucesso!"
            });
        }
    );
});

// =========================
// INICIAR SERVIDOR
// =========================

app.listen(PORT, "0.0.0.0", () => {

    console.log("================================");
    console.log("SERVIDOR INICIADO");
    console.log(`http://localhost:${PORT}`);
    console.log("================================");

});