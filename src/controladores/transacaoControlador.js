const pool = require("../conexao");

const cadastrar = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  try {
    const querySelecionaIdDaCategorias = `
      select * from categorias
      where id = $1
    `;

    const { rowCount: qtdCategoria, rows: categorias } = await pool.query(
      querySelecionaIdDaCategorias,
      [categoria_id]
    );

    if (qtdCategoria < 1) {
      return res.status(404).json({ mensagem: "Categoria inexistente." });
    }

    const queryCadastraTransacao = `
      insert into transacoes
      (descricao, valor, data, categoria_id, usuario_id, tipo)
      values
      ($1, $2, $3, $4, $5, $6)
      returning *
    `;
    const values = [descricao, valor, data, categoria_id, req.usuario.id, tipo];

    const { rows } = await pool.query(queryCadastraTransacao, values);

    const transacao = rows[0];
    const categoria_nome = categorias[0].descricao;

    const objetoResposta = { ...transacao, categoria_nome };

    return res.status(201).json(objetoResposta);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor em cadastrar transação" });
  }
};

const listar = async (req, res) => {
  try {
    //este join só é necessário devido aos campos de output do exemplo dao readme do desafio.
    const querySelecionaTodasAsTransacoesPorIdDeUsuario = `
      select  *, t.id as id, t. descricao as descricao , c.descricao as categoria_nome from transacoes as t
      left join categorias as c
      on usuario_id = $1
      where t.categoria_id = c.id;  
    `;

    const { rows: transacoesPorUsuario } = await pool.query(
      querySelecionaTodasAsTransacoesPorIdDeUsuario,
      [req.usuario.id]
    );

    return res.status(200).send(transacoesPorUsuario);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor - em listar transacao" });
  }
};

const detalhar = async (req, res) => {
  try {
    const querySelecionaUmaTransacaoDeUsuario = `
    select  *, t.id as id, t. descricao as descricao , c.descricao as categoria_nome from transacoes as t
    join categorias as c
    on c.id = t.categoria_id
    where ( t.id = $1 and t.usuario_id = $2);
    `;

    const { rowCount, rows: transacao } = await pool.query(
      querySelecionaUmaTransacaoDeUsuario,
      [req.params.id, req.usuario.id]
    );

    if (rowCount < 1) {
      return res.status(404).json({
        mensagem: "Transação não encontrada.",
      });
    }

    return res.status(200).send(transacao[0]);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor em detalhar transação" });
  }
};

const atualizar = async (req, res) => {
  const idDaTransacao = req.params.id;
  const idDeUsuario = req.usuario.id;
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  try {
    const querySelecionaTransacaoPeloIdEIdDeUsuario = `
      select * from transacoes
      where (id = $1 and usuario_id = $2)

    `;

    const { rowCount: qtdTrasacoes } = await pool.query(
      querySelecionaTransacaoPeloIdEIdDeUsuario,
      [idDaTransacao, idDeUsuario]
    );

    if (qtdTrasacoes < 1) {
      return res.status(404).json({ mensagem: "Transação inexistente." });
    }

    const querySelecionaIdDaCategoria = `
      select * from categorias
      where id = $1
    `;

    const { rowCount: qtdCategoria } = await pool.query(
      querySelecionaIdDaCategoria,
      [categoria_id]
    );

    if (qtdCategoria < 1) {
      return res.status(404).json({ mensagem: "Categoria inexistente." });
    }

    const queryAtualizaTransacao = `
      update transacoes
      set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5
      where (id = $6 and usuario_id = $7)
    `;
    const sets = [
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
      idDaTransacao,
      idDeUsuario,
    ];
    await pool.query(queryAtualizaTransacao, sets);

    return res.status(201).send();
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor em atualizar transação" });
  }
};

const excluir = async (req, res) => {
  const idDaTransacao = req.params.id;
  const idDeUsuario = req.usuario.id;

  try {
    const querySelecionaTransacaoPeloIdEIdDeUsuario = `
      select * from transacoes
      where (id = $1 and usuario_id = $2)

    `;

    const { rowCount: qtdTrasacoes } = await pool.query(
      querySelecionaTransacaoPeloIdEIdDeUsuario,
      [idDaTransacao, idDeUsuario]
    );

    if (qtdTrasacoes < 1) {
      return res.status(404).json({
        mensagem: "Transação não encontrada.",
      });
    }

    const queryDeletaTransacaoPeloId = `
      delete from transacoes
      where (id = $1 and usuario_id = $2)
    `;

    await pool.query(queryDeletaTransacaoPeloId, [idDaTransacao, idDeUsuario]);

    return res.status(204).send();
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor em excluir transação" });
  }
};

const extrato = async (req, res) => {
  const idDeUsuario = req.usuario.id;
  try {
    const querySelecionaSomaDeEntradas = `
    select sum(valor) as entrada 
    from transacoes 
    where (tipo = 'entrada' and usuario_id = $1);
    `;

    const { rows: somaValorEntradas } = await pool.query(
      querySelecionaSomaDeEntradas,
      [idDeUsuario]
    );

    const querySelecionaSomaDeSaidas = `
    select sum(valor) as saida 
    from transacoes 
    where (tipo = 'saida' and usuario_id = $1);
    `;

    let { rows: somaValorSaidas } = await pool.query(
      querySelecionaSomaDeSaidas,
      [idDeUsuario]
    );

    const extrato = {
      entrada: (somaValorEntradas[0].entrada ??= 0),
      saida: (somaValorSaidas[0].saida ??= 0),
    };

    return res.status(200).json(extrato);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor em extrato de transações" });
  }
};

module.exports = { cadastrar, listar, detalhar, atualizar, excluir, extrato };

// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
