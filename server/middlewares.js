const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { User } = require('./database');
const { HOD, MEMBER } = require("./database/types");

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

const deleteUserValidator = async (req, res, next) => {
    next();
}

const authValidator = (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.token) return res.status(403).json({ error: "Unauthenticated" });

        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.name = verified.name;
        req.loginid = verified.loginid;
        req.email = verified.email;
        req.designation = verified.designation;

        // only for members and hods
        if (verified.deptName) {
            req.deptName = verified.deptName;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ error: `Unauthenticated, ${error}` });
    }
}

// create and return a middleware
const authorizationHandler = authorizedUsersList => {
    // this middleware check if user is in authorizedUserList and is in authorized department
    return (req, res, next) => {
        try {
            const designation = req.designation;
            if (!designation || !authorizedUsersList.includes(designation))
                throw new Error("This designation is not authorized");
            // for Members and HODs
            if ([HOD, MEMBER].includes(designation)) {
                const deptName = (req.query && req.query.deptName) || (req.body && req.body.deptName);
                if (req.deptName !== deptName) throw new Error("This action is not authorized by this Department");
            }
            next();
        } catch (error) {
            res.status(401).json({ error: `Unauthorized, ${error}` });
        }
    }
}

const loggingMiddleware = (req, res, next) => {
    console.log(req.method, req.url);
    next();
}


module.exports = {
    loginValidator, registerValidator, authValidator,
    loggingMiddleware, deleteUserValidator, authorizationHandler
};