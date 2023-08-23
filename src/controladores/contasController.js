let { contas, saques, depositos, transferencias } = require('../bancodedados');
let numeroConta = 1;
let saldo = 0;

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }

    const cpfEncontrado = contas.find(conta => contas.cpf === cpf)


    if (cpfEncontrado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" });
    }

    const emailEncontrado = contas.find(email => contas.email === email)

    if (emailEncontrado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o email informado!" });
    }

    let usuario = {
        numeroConta: numeroConta++,
        saldo,
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
    }

    contas.push(usuario);
    return res.status(201).json(usuario);
};

const listagemDeContas = (req, res) => {

    return res.status(200).json(contas);
}

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }

    const numeroContaEncontrada = contas.find((conta) => {
        return conta.numeroConta === Number(numeroConta);
    });


    if (!numeroContaEncontrada) {
        return res.status(404).json({ mensagem: "O número da conta é inválido" });
    }

    const cpfEncontrado = contas.find(conta => contas.cpf === cpf)

    if (cpfEncontrado) {
        return res.status(400).json({ mensagem: "O CPF informado já existe cadastrado!" });
    }

    const emailEncontrado = contas.find(email => contas.email === email)

    if (emailEncontrado) {
        return res.status(400).json({ mensagem: "O email informado já existe cadastrado!" });
    }

    numeroContaEncontrada.nome = nome;
    numeroContaEncontrada.cpf = cpf;
    numeroContaEncontrada.data_nascimento = data_nascimento;
    numeroContaEncontrada.telefone = telefone;
    numeroContaEncontrada.email = email;
    numeroContaEncontrada.senha = senha;

    return res.status(203).send();

}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const numeroContaEncontrada = contas.find((conta) => {
        return conta.numeroConta === Number(numeroConta);
    });


    if (!numeroContaEncontrada) {
        return res.status(404).json({ mensagem: "O número da conta é inválido" });
    }

    if (contas.saldo !== 0) {

        contas = contas.filter((conta) => {
            return conta.numeroConta !== Number(numeroConta);
        });

        return res.status(204).send();
    }

}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numeroConta === Number(numero_conta);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "Operação inválida" });
    }

    const dataDeposito = new Date();

    contaEncontrada.saldo += valor;
    depositos.push({
        dataDeposito,
        numero_conta,
        valor,
    });

    return res.status(204).send();

}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numeroConta === Number(numero_conta);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }

    if (senha !== contaEncontrada.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    if (contaEncontrada.saldo === 0 || valor > contaEncontrada.saldo) {
        return res.status(400).json({ mensagem: "Saldo indisponível para saque" });
    }

    const dataSaque = new Date();

    const valorRestante = contaEncontrada.saldo - valor;

    contaEncontrada.saldo = valorRestante;

    saques.push({
        dataSaque,
        numero_conta,
        valorRestante
    });

    return res.status(204).send();

}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const contaDeOrigem = contas.find(conta => conta.numeroConta === numero_conta_origem);
    const contaDeDestino = contas.find(conta => conta.numeroConta === numero_conta_destino);

    if (!contaDeOrigem) {
        return res.status(404).json({ mensagem: "Conta de origem não encontrada" });
    }

    if (!contaDeDestino) {
        return res.status(404).json({ mensagem: "Conta de destino não encontrada" });
    }

    if (senha !== contaDeOrigem.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    if (contaDeOrigem.saldo === 0 || valor > contaDeOrigem.saldo) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" });
    }

    contaDeOrigem.saldo -= valor;
    contaDeDestino.saldo += valor;

    const dataTransferencia = new Date();

    transferencias.push({
        dataTransferencia,
        numero_conta_origem,
        numero_conta_destino,
        valor,
    });

    return res.status(204).send();

}

const verificarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numeroConta === Number(numero_conta);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }

    if (senha !== contaEncontrada.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    saldo = contaEncontrada.saldo;

    return res.status(200).json({ "saldo": saldo });

}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numeroConta === Number(numero_conta);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }

    if (senha !== contaEncontrada.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }


    return res.status(200).json({ depositos, saques, transferencias });

}

module.exports = {
    criarConta,
    listagemDeContas,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    verificarSaldo,
    extrato
}
