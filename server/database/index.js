const mysql = require('mysql2/promise');
const { HOD, MEMBER, EXAMOFFICER, EXAMCONTROLLER } = require('./types');

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
const createNewUser = async ({ name, loginid, password, designation, deptName }) => {
    if (designation === HOD || designation === MEMBER) {
        await sqlDatabase.execute(`insert into member(name, loginid, password,  designation, deptname) values ("${name}","${loginid}","${password}","${designation}","${deptName}");`);
    }
    else if (designation === EXAMOFFICER || designation === EXAMCONTROLLER) {
        await sqlDatabase.execute(`insert into examoffice(name, loginid, password,  designation, deptname) values ("${name}","${loginid}","${password}","${designation}","${deptName}");`);
    }
    else {
        throw new ERROR('designation doesnot exist');
    }
}

const getUserById = async loginid => {
    const [rowsem] = await sqlDatabase.execute(`select * from ExamOffice where loginid="${loginid}"`);
    const [rowM] = await sqlDatabase.execute(`select * from Member where loginid="${loginid}"`);

    if (!rowM.length && rowsem.length) return rowsem[0];
    else if (!rowsem.length && rowM.length) return rowM[0];
    else return null;
}


const deleteUser = async ({ loginid, designation }) => {
    if (designation === HOD || designation === MEMBER) {
        await sqlDatabase.execute(`delete from Member where loginid = "${loginid}"`);
    }
    else if (designation === EXAMOFFICER || designation === EXAMCONTROLLER) {
        await sqlDatabase.execute(`delete from ExamOffice where loginid = "${loginid}"`);
    }
}

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
    // tableData = [ { id, subNomenclature, subCode, template } ]
    let str = `("${tableData[0].id}", "${tableData[0].SubNomenclature}", "${tableData[0].SubCode}", "${tableData[0].Template}", "${deptName}")`;
    for (let i = 1; i < tableData.length; ++i) {
        str = `${str}, ("${tableData[i].id}", "${tableData[i].SubNomenclature}", "${tableData[i].SubCode}", "${tableData[i].Template}", "${deptName}")`
    }
    await sqlDatabase.execute(`delete from ExamModule where DeptName="${deptName}"`)
    await sqlDatabase.execute(`insert into ExamModule (id, SubNomenclature, SubCode, Template, DeptName) values ${str}`)
}

const getDepartmentTable = async deptName => {
    const [rows] = await sqlDatabase.execute(`SELECT id, subNomenclature, subCode, examCode,template, syllabus, deptName,
    examiner1 as examiner1_email, examiner1.Name as examiner1_name, examiner1.ContactNo as examiner1_contactNo, 
    examiner2 as examiner2_email, examiner2.Name as examiner2_name, examiner2.ContactNo as examiner2_contactNo FROM exammodule 
    JOIN examiner1 on exammodule.examiner1=examiner1.email
    JOIN examiner2 on exammodule.examiner2=examiner2.email
    where deptName = '${deptName}' `);
    return rows;
}

const postDepartmentTable = async ({ tableData, deptName }) => {
    // tableData = [ { id, subNomenclature, subCode, template, examiner1_email, examiner1_name, examiner1_contactNo, examiner2_email, examiner2_name, examiner2_contactNo, syllabus } ]
}

const commitRow = async ({ deptName, rowData, memberName, memberLoginId }) => {
    // rowData = { id, subNomenclature, subCode, template, examiner1_email, examiner1_name, examiner1_contactNo, examiner2_email, examiner2_name, examiner2_contactNo, syllabus }
}


const getDeptStatus = async deptName => {
    const [rows] = await sqlDatabase.execute(`select sendStatus from Approval where DeptName="${deptName}"`);
    return rows[0];
}

const postDeptStatus = async deptName => {
    await sqlDatabase.execute(`update Approval set sendStatus=true where deptName="${deptName}"`);
}

const getApproval1 = async deptName => {
    const [rows] = await sqlDatabase.execute(`select approval1 from Approval where DeptName="${deptName}"`);
    return rows[0];
}

const putApproval1 = async deptName => {
    await sqlDatabase.execute(`update Approval set approval1=true where deptName="${deptName}"`);
}

const getApproval2 = async deptName => {
    const [rows] = await sqlDatabase.execute(`select approval2 from Approval where DeptName="${deptName}"`);
    return rows[0];
}

const putApproval2 = async deptName => {
    await sqlDatabase.execute(`update Approval set approval2=true where deptName="${deptName}"`);
}

const getExcellSheet = async () => {
    // return [ { id, subNomenclature, subCode, examCode, template, examiner1_email, examiner1_name, examiner1_contactNo, examiner2_email, examiner2_name, examiner2_contactNo, syllabus, deptName } ]
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

