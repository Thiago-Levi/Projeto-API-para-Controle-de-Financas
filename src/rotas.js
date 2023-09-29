const express = require("express");
const rotas = express();
const intermediarioUsuario = require("./intermediarios/usuarioIntermediario");
const usuario = require("./controladores/usuarioControlador");
const autenticacaoDoSistema = require("./intermediarios/autenticacaoDoSistema");
const categoria = require("./controladores/categoriaControlador");
const transacao = require("./controladores/transacaoControlador");
const intermediarioTransacao = require("./intermediarios/transacaoIntermediario");

rotas.post(
  "/usuario",
  intermediarioUsuario.validarCadastrar,
  usuario.cadastrar
);

rotas.post("/login", intermediarioUsuario.validarlogin, usuario.login);

rotas.use(autenticacaoDoSistema.validarAutenticacaoDeUsuario);

rotas.get("/usuario", usuario.detalhar);

rotas.put("/usuario", intermediarioUsuario.validarAtualizar, usuario.atualizar);

rotas.get("/categoria", categoria.listar);

rotas.post(
  "/transacao",
  intermediarioTransacao.validarCadastrar,
  transacao.cadastrar
);

rotas.get("/transacao", transacao.listar);

//Importante: A criação desta rota("transacao/extrato"), no arquivo rotas.js, deverá acontecer antes da criação da rota de detalhamento de uma transação (GET /transacao/:id), caso contrário, esta rota nunca será possível ser acessada.
rotas.get("/transacao/extrato", transacao.extrato);

rotas.get("/transacao/:id", transacao.detalhar);

rotas.put(
  "/transacao/:id",
  intermediarioTransacao.validarAtualizar,
  transacao.atualizar
);

rotas.delete(
  "/transacao/:id",
  intermediarioTransacao.validarExcluir,
  transacao.excluir
);

module.exports = rotas;
