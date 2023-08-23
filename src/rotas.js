const express = require('express');
const { criarConta, listagemDeContas, atualizarUsuario, excluirConta, depositar, sacar, transferir, verificarSaldo, extrato } = require('./controladores/contascontroller');
const { banco, contas, saques, depositos, transferencias } = require('./bancodedados');
const validarSenha = require('./intermediario');

const rotas = express();

rotas.post('/contas', criarConta);
rotas.get('/contas', validarSenha, listagemDeContas);
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', verificarSaldo);
rotas.get('/contas/extrato', extrato);

module.exports = rotas;