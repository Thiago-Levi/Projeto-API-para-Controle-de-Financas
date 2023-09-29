const funcoesUtilitarias = require("../utilitarios/funcoesUtilitarias");

const validarCadastrar = (req, res, next) => {
  const { nome, email, senha } = req.body;
  const emailValidado = funcoesUtilitarias.validarEmail(email);

  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: "Todos os campos são obrigatórios",
    });
  }

  if (!emailValidado) {
    return res.status(400).json({
      mensagem: "Formato de email é inválido",
    });
  }

  next();
};

const validarlogin = (req, res, next) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Email e Senha são obrigatórios",
    });
  }

  next();
};

const validarAtualizar = (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: "Nome, Email e Senha são obrigatórios",
    });
  }
  const emailValidado = funcoesUtilitarias.validarEmail(email);

  if (!emailValidado) {
    return res.status(400).json({
      mensagem: "formato de email é inválido",
    });
  }

  next();
};

module.exports = { validarCadastrar, validarlogin, validarAtualizar };

// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
