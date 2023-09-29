const pool = require("../conexao");

const validarCadastrar = async (req, res, next) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser informados.",
    });
  }

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({
      mensagem:
        "O tipo enviado no corpo (body) da requisição deve corresponder a palavra 'entrada' ou 'saida', exatamente como descrito.",
    });
  }

  next();
};

const validarAtualizar = async (req, res, next) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser informados.",
    });
  }

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({
      mensagem:
        "O tipo enviado no corpo (body) da requisição deve corresponder a palavra 'entrada' ou 'saida', exatamente como descrito.",
    });
  }

  next();
};

const validarExcluir = async (req, res, next) => {
  const idDaTransacao = req.params.id;

  if (!idDaTransacao) {
    return res.status(400).json({
      mensagem: "Deve ser enviado o ID da transação no parâmetro de rota.",
    });
  }
  next();
};

module.exports = { validarCadastrar, validarAtualizar, validarExcluir };
