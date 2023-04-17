const mysql = require('mysql2/promise');

/**
* @type {mysql.Connection}
*/
let sqlDatabase = null;

const connectDB = async () => {
    sqlDatabase = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    console.log("DataBase Connected !!!");
}

// User
const createNewUser = async ({ name, loginid, email, passwordHash, entity }) => {
}
const getUserById = async loginid => {
    return {};
}
const findOneUser = async filter => {
    // don't write its code !
    return {};
}

// all other database queries
const getDeptNames = async () => {
    const [rows] = await sqlDatabase.execute("select * from exam_subcommitee");
    return rows.map(ele => ele.Department)
}

const postDeptNames = async deptNames => {
    await sqlDatabase.execute(`delete from exam_subcommitee`);

    let str = `("${deptNames[0]}")`;
    for (let i = 1; i < deptNames.length; ++i) {
        str = `${str}, ("${deptNames[i]}")`
    }
    await sqlDatabase.execute(`insert into exam_subcommitee values ${str}`);
}

const getDeptTableWithoutExaminers = async () => {
    const [rows] = await sqlDatabase.execute('select Id, SubNomenclature, SubCode, Template from Exam_Module')
    console.log(rows)
    return rows
}


const postDeptTableWithoutExaminers = async ({ tableData, deptName }) => {
    // [{id, SubNomenclature, SubCode, Template}]
    let str = `("${tableData[0].id}", "${tableData[0].SubNomenclature}", "${tableData[0].SubCode}", "${tableData[0].Template}", "${deptName}")`;
    for (let i = 1; i < tableData.length; ++i) {
        str = `${str}, ("${tableData[i].id}", "${tableData[i].SubNomenclature}", "${tableData[i].SubCode}", "${tableData[i].Template}", "${deptName}")`
    }
    await sqlDatabase.execute(`delete from Exam_Module where DeptName="${deptName}"`)
    await sqlDatabase.execute(`insert into Exam_Module (id, SubNomenclature, SubCode, Template, DeptName) values ${str}`)
}
module.exports = {
    connectDB,
    User: { createNewUser, getUserById, findOneUser },
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers,
}


