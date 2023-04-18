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
const createNewUser = async ({ name, loginid, password, entity }) => { }

const getUserById = async loginid => {
    const [rows] = await sqlDatabase.execute(`select * from ExamOffice where loginid="${loginid}"`);
    return rows[0];
}

const deleteUser = async loginid => { }

// all other database queries
const getDeptNames = async () => {
    const [rows] = await sqlDatabase.execute("select * from examsubcommitee");
    return rows.map(ele => ele.Department)
}

const postDeptNames = async deptNames => {
    await sqlDatabase.execute(`delete from examsubcommitee`);

    let str = `("${deptNames[0]}")`;
    for (let i = 1; i < deptNames.length; ++i) {
        str = `${str}, ("${deptNames[i]}")`
    }
    await sqlDatabase.execute(`insert into examsubcommitee values ${str}`);
}

const getDeptTableWithoutExaminers = async deptName => {
    const [rows] = await sqlDatabase.execute(`select Id, SubNomenclature, SubCode, Template from ExamModule where deptName="${deptName}"`)
    return rows;
}

const postDeptTableWithoutExaminers = async ({ tableData, deptName }) => {
    // tableData = [ { id, SubNomenclature, SubCode, Template } ]
    let str = `("${tableData[0].id}", "${tableData[0].SubNomenclature}", "${tableData[0].SubCode}", "${tableData[0].Template}", "${deptName}")`;
    for (let i = 1; i < tableData.length; ++i) {
        str = `${str}, ("${tableData[i].id}", "${tableData[i].SubNomenclature}", "${tableData[i].SubCode}", "${tableData[i].Template}", "${deptName}")`
    }
    await sqlDatabase.execute(`delete from ExamModule where DeptName="${deptName}"`)
    await sqlDatabase.execute(`insert into ExamModule (id, SubNomenclature, SubCode, Template, DeptName) values ${str}`)
}

const getDepartmentTable = async deptName => { }

const postDepartmentTable = async ({ tableData, deptName }) => {
    // tableData = [ { id, SubNomenclature, SubCode, Template, Examiner1, Examiner2, Syllabus } ]
    // Examiner1 = { Email, Name, ContactNo }
    // Examiner2 = { Email, Name, ContactNo }
}

const commitRow = async ({ deptName, rowData, memberName, memberLoginId }) => {
    // rowData = { id, SubNomenclature, SubCode, Template, Examiner1, Examiner2, Syllabus }
    // Examiner1 = { Email, Name, ContactNo }
    // Examiner2 = { Email, Name, ContactNo }
}

const getDeptStatus = async deptName => { }

const postDeptStatus = async deptName => { }

const getApproval1 = async deptName => { }

const putApproval1 = async deptName => { }

const getApproval2 = async deptName => { }

const putApproval2 = async deptName => { }

const getExcellSheet = async () => {
    // return [ { id, SubNomenclature, SubCode, ExamCode, Template, Examiner1_email, Examiner1_name, Examiner1_contactno, Examiner2_email, Examiner2_name, Examiner2_contactno, Syllabus, deptName } ]
    // imp: above order is necessary here !
}

const clearDatabase = async () => { }

const getAllExaminers = async () => {
    // get all entries of Examiner 1 and Examiner 2 and merge then in single array and return it.
    // return [ { email, name, contactno } ]
}


module.exports = {
    connectDB,
    User: { createNewUser, getUserById, deleteUser },
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers, getDepartmentTable,
    postDepartmentTable, commitRow, getDeptStatus,
    postDeptStatus, getApproval1, putApproval1,
    getApproval2, putApproval2, getExcellSheet,
    clearDatabase, getAllExaminers
}

