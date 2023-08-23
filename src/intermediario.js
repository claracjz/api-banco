const validarSenha = (req, res, next) => {
    const senhaCorreta = "Cubos123Bank";
    const senhaDadaUrl = req.query.senha_banco;

    if (!senhaDadaUrl) {
        return res.status(400).json({ mensagem: "A senha do banco não foi informada!" });
    }

    if (senhaDadaUrl !== senhaCorreta) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }

    next();

}

module.exports = validarSenha;