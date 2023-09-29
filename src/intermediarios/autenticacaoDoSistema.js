const jwt = require("jsonwebtoken");
const senhaInternaJwt = require("../senhaJwt");
const pool = require("../conexao");

const validarAutenticacaoDeUsuario = async (req, res, next) => {
  const { authorization: token } = req.headers;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
  try {
    //Remove Bearer do início do token
    const tokenSemBearer = token.replace("Bearer ", "").trim();

    //Verifica e retorna um id
    const { id } = jwt.verify(tokenSemBearer, senhaInternaJwt);

    //Consultar usuário no BD pelo id no token
    const selecionarUsuario = `
    select * from usuarios where id = $1
    `;

    const { rowCount, rows } = await pool.query(selecionarUsuario, [id]);

    //Verifica se o usuário está no BD
    if (rowCount < 1) {
      return res.status(401).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    //Armazena as informações do usuário no objeto da requisição para uso posterior
    req.usuario = rows[0];

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  //next();
};

module.exports = { validarAutenticacaoDeUsuario };
