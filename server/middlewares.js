const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { User } = require('./database');
const { HOD, MEMBER, ADMIN, EXAMCONTROLLER, EXAMOFFICER } = require("./database/types");
const { getPhase } = require('./controllers/explore');

const loginValidator = async (req, res, next) => {

    let { loginid, password } = req.body;

    loginid = loginid ? loginid.trim() : '';
    password = password ? password.trim() : '';

    try {
        if (!password || !loginid)
            return res.status(400).json({ error: "Please enter all required fields." });

        // existingUser = {loginid, password, name, designation, deptName*}
        const existingUser = await User.getUserById(loginid);

        if (!existingUser)
            return res.status(401).json({ error: `Wrong loginid or password.` });

        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.password
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

    let { name, loginid, password, designation } = req.body;

    name = name ? name.trim() : '';
    loginid = loginid ? loginid.trim() : '';

    try {
        if (!name || !loginid || !password || !designation)
            return res.status(400).json({
                error: `Please enter all required fields.  Missing :${!name ? ' name' : ''}${!loginid ? ' loginid' : ''}${!password ? ' password' : ''}${!designation ? ' password' : ''}`
            });

        if (name.length >= 100)
            return res.status(400).json({
                error: "Name should be less that 100 characters"
            });

        if (loginid.length <= 2)
            return res.status(400).json({
                error: "loginid should be greater than 2 characters"
            });

        if (password.length < 4)
            return res.status(400).json({
                error: "Please enter a password of at least 4 characters.",
            });

        if (![ADMIN, HOD, MEMBER, EXAMCONTROLLER, EXAMOFFICER].includes(designation)) {
            return res.status(400).json({
                error: "designation should be either one of these : admin,hod,member,examcontroller,examofficer"
            });
        }

        const existingUser = await User.getUserById(loginid);
        if (existingUser)
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
        if (!req.cookies || !req.cookies.token) return res.status(403).json({ error: "Unauthenticated" });

        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.name = verified.name;
        req.loginid = verified.loginid;
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
    // this middleware check if user is in authorizedUserList or Admin and is in authorized department
    return (req, res, next) => {
        try {
            const designation = req.designation.toLowerCase();
            if (!designation || designation !== ADMIN && (!authorizedUsersList.includes(designation)))
                throw new Error("This designation is not authorized");
            // for Members and HODs -> department level access
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

// create and return a middleware
const phaseValidator = phaseList => {
    // this middleware check if api call is allowed in currentPhase by checking phaseList
    return async (req, res, next) => {
        try {
            const currentPhase = await getPhase(req.deptName);
            if (req.designation !== ADMIN && !phaseList.includes(currentPhase)) throw new Error("Can't call this api in current phase: " + currentPhase);
            req.phase = currentPhase;
            next();
        } catch (error) {
            res.status(401).json("Phase Validation Error: " + error.message);
        }
    }
}

const loggingMiddleware = (req, res, next) => {
    console.log(req.method, req.url);
    next();
}


module.exports = {
    loginValidator, registerValidator, authValidator,
    loggingMiddleware, authorizationHandler, phaseValidator
};