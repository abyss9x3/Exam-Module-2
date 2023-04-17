const mysql = require('mysql2/promise');

/**
* @type {mysql.Connection}
*/
let sqlDatabase = null;

const connectDB = async () => {
    sqlDatabase = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Shreyansh@24',
        database: 'em2'
    });

    console.log("DataBase Connected !!!");
}

// User
const createNewUser = async ({ name, loginid, email, passwordHash, entity }) => {
    return {};
}
const getUserById = async loginid => {
    return {};
}
const findOneUser = async filter => {
    return {};
}

// all other database queries
const getDeptNames = async () => {
    const [rows, fields] = await sqlDatabase.execute("select * from Exam_SubCommittee");
    return [];
}

module.exports = {
    connectDB,
    User: { createNewUser, getUserById, findOneUser },
    getDeptNames,
}


