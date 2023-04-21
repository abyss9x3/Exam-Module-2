const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require('../database');
const database = require("../database");

const loginController = async (req, res) => {
    try {
        const { loginid, name, designation, deptName } = req.existingUser;
        // sign the token
        const token = jwt.sign(
            { loginid, name, designation, deptName },
            process.env.JWT_SECRET
        );

        // send the token in a HTTP-only cookie
        return res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
        }).status(200).json({ msg: "Logged In" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Error" });
    }
}

const registerController = async (req, res) => {
    try {
        const { name, loginid, password, designation, deptName } = req.body;

        // hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // save a new user account to the db
        await User.createNewUser({ name, loginid, password: passwordHash, designation, deptName });

        return res.status(200).json({ msg: "Registered" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Error" });
    }
}

const logoutController = (req, res) => {
    return res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        // secure: true,
        // sameSite: "none",
    }).status(200).json({ msg: "Logged Out" });
}

const loggedInController = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.token) return res.json(false);

        const {
            loginid, name, designation, deptName
        } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        return res.status(200).json({ status: true, loginid, name, designation, deptName });
    } catch (err) {
        console.error(err);
        return res.status(200).json({ status: false });
    }
}

const deleteUserController = async (req, res) => {
    try {
        const loginid = (req.query && req.query.loginid) || (req.body && req.body.loginid);
        if (!loginid) {
            return res.status(400).json({ error: "Please enter all required fields.  Missing: loginid" });
        }

        const existingUser = await database.User.getUserById(loginid);
        if (!existingUser) {
            return res.status(400).json({ error: "login id does not exists" });
        }

        await database.User.deleteUser({ loginid, designation: existingUser.designation });
        return res.status(200).json(`User ${loginid} deleted !`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Error", serverError: error });
    }
}

module.exports = {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    deleteUserController
};
