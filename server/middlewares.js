const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { User } = require('./database');

const loginValidator = async (req, res, next) => {

    let { loginid, password } = req.body;

    loginid = loginid ? loginid.trim() : '';
    password = password ? password.trim() : '';

    try {
        if (!password || !loginid)
            return res.status(400).json({ error: "Please enter all required fields." });

        const existingUser = await User.findOneUser({ loginid });

        if (!existingUser)
            return res.status(401).json({ error: `Wrong loginid or password.` });

        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.passwordHash
        );
        if (!passwordCorrect)
            return res.status(401).json({ error: `Wrong loginid or password.` });

        req.existingUser = existingUser;

        next();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const registerValidator = async (req, res, next) => {

    let { name, loginid, email, password, passwordVerify } = req.body;

    name = name ? name.trim() : '';
    loginid = loginid ? loginid.trim() : '';

    try {
        if (!name || !loginid || !email || !password || !passwordVerify)
            return res.status(400).json({
                error: `Please enter all required fields.  Missing :${!name ? ' name' : ''}${!loginid ? ' loginid' : ''}${!email ? ' email' : ''}${!password ? ' password' : ''}${!passwordVerify ? ' passwordVerify' : ''}`
            });

        if (name.length >= 10)
            return res.status(400).json({
                error: "Name should be less that 10 characters"
            });

        if (loginid.length >= 10 || loginid.length < 4)
            return res.status(400).json({
                error: "loginid should be less that 10 characters and greater than or equal to 4 characters"
            });

        if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)))
            return res.status(400).json({
                error: "Email is not valid"
            });

        if (password.length < 6)
            return res.status(400).json({
                error: "Please enter a password of at least 6 characters.",
            });

        if (password !== passwordVerify)
            return res.status(400).json({
                error: "Please enter the same password twice.",
            });

        if (loginid.toLowerCase().includes('aman')) {
            return res.status(400).json({
                error: "These loginids (including 'aman') are reserved for Admin Only !"
            });
        }

        const existingUserE = await User.findOneUser({ email });
        if (existingUserE)
            return res.status(400).json({
                error: "An account with this email already exists.",
            });

        const existingUserL = await User.findOneUser({ loginid });
        if (existingUserL)
            return res.status(400).json({
                error: "An account with this loginid already exists.",
            });

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const authValidator = (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.token) return res.status(401).json({ error: "Unauthorized" });

        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;
        req.loginid = verified.loginid;
        req.email = verified.email;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Unauthorized" });
    }
}

const loggingMiddleware = (req, res, next) => {
    console.log(req.method, req.url);
    next();
}

const deleteUserValidator = async (req, res, next) => {
    next();
}

module.exports = {
    loginValidator, registerValidator, authValidator,
    loggingMiddleware, deleteUserValidator
};