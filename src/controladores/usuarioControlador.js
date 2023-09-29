const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaInternaJwt = require("../senhaJwt");
const pool = require("../conexao");

const cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const querySelecionarEmail = `
      select * from usuarios
      where email = $1
    `;

    const { rowCount } = await pool.query(querySelecionarEmail, [email]);

    if (rowCount > 0) {
      return res.status(401).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    //criptografando a senha antes de inserir no banco de dados
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const queryInserir = `
      insert into usuarios
      (nome, email, senha)
      values
      ($1, $2, $3)
      returning *
      `;

    //Cadastrando o usuário no banco de dados
    const { rows } = await pool.query(queryInserir, [
      nome,
      email,
      senhaCriptografada,
    ]);

    const { senha: _, ...usuarioCadastrado } = rows[0];

    return res.status(201).json(usuarioCadastrado);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const querySelecionarEmail = `
      select * from usuarios
      where email = $1
    `;

    //verificando se o email informado pelo usuário existe no banco de dados
    const { rows, rowCount } = await pool.query(querySelecionarEmail, [email]);

    if (rowCount < 1) {
      return res.status(403).json({
        mensagem: "Usuário e/ou senha inválido(s).",
      });
    }

    //armazenando as informações de usuário vindas do select anterior
    const infosIternasDoUsuario = rows[0];

    // Comparando/verificando/validando a senha informada na requisição com a senha em forma de hash do banco de dados
    const senhaValidada = await bcrypt.compare(
      senha,
      infosIternasDoUsuario.senha
    );

    if (!senhaValidada) {
      return res.status(403).json({
        mensagem: "Usuário e/ou senha inválido(s).",
      });
    }

    //Gerando o token com as informações id, senhaInternaJwt e tempo de expiração.
    const token = jwt.sign({ id: infosIternasDoUsuario.id }, senhaInternaJwt, {
      expiresIn: "8h",
    });

    const { senha: _, ...usuario } = infosIternasDoUsuario;

    //retornando as informações de usuário e o token de usuário no json de resposta.
    return res.status(200).json({ usuario, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const detalhar = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }

    const usuario = req.usuario;

    const usuarioDetalhado = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };

    return res.status(200).json(usuarioDetalhado);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Erro interno do servidor.");
  }
};

const atualizar = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.usuario;

  try {
    const querySelecionaPeloEmail = `
      select * from usuarios
      where (email = $1 and id <> $2)
      `;

    const { rowCount } = await pool.query(querySelecionaPeloEmail, [email, id]);

    if (rowCount > 0) {
      return res.status(400).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const queryAtualizarInfosDoUsuario = `
    update usuarios
    set nome = $1, email = $2, senha = $3
    where id = $4
    `;

    await pool.query(queryAtualizarInfosDoUsuario, [
      nome,
      email,
      senhaCriptografada,
      id,
    ]);

    return res.status(204).send();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = { cadastrar, login, detalhar, atualizar };

// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
