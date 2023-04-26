const mysql = require('mysql2/promise');
const { HOD, MEMBER, EXAMOFFICER, EXAMCONTROLLER } = require('./types');

/** @type {mysql.Connection} */
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

// User - Queries related to login/signup/deleteUser
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
    const [rows] = await sqlDatabase.execute("select * from examsubcommittee");
    return rows.map(ele => ele.deptName);
}

const postDeptNames = async deptNames => {
    await sqlDatabase.execute(`delete from examsubcommittee`);

    let str = `("${deptNames[0]}")`;
    for (let i = 1; i < deptNames.length; ++i) {
        str = `${str}, ("${deptNames[i]}")`
    }
    await sqlDatabase.execute(`insert into examsubcommittee values ${str}`);
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
    const [rows] = await sqlDatabase.execute(`
    SELECT id, subNomenclature, subCode, template, syllabus, deptName,
    examiner1 as examiner1_email, examiner1.Name as examiner1_name, examiner1.ContactNo as examiner1_contactNo, 
    examiner2 as examiner2_email, examiner2.Name as examiner2_name, examiner2.ContactNo as examiner2_contactNo,
    commits.member  as member
    FROM exammodule
    
    LEFT JOIN Examiner1 on Exammodule.examiner1=examiner1.email
    LEFT JOIN Examiner2 on Exammodule.examiner2=examiner2.email
    LEFT JOIN commits on exammodule.id=commits.examModuleID
    where deptName = '${deptName}' `);
    return rows;
}


const getDepartmentTableWithoutCommits = async deptName => {
    const [rows] = await sqlDatabase.execute(`
    SELECT id, subNomenclature, subCode, template, syllabus, deptName,
    examiner1 as examiner1_email, examiner1.Name as examiner1_name, examiner1.ContactNo as examiner1_contactNo, 
    examiner2 as examiner2_email, examiner2.Name as examiner2_name, examiner2.ContactNo as examiner2_contactNo FROM exammodule 
    LEFT JOIN examiner1 on exammodule.examiner1=examiner1.email
    LEFT JOIN examiner2 on exammodule.examiner2=examiner2.email
    where deptName = '${deptName}' `);
    return rows;
}

const postExaminers = async tableData => {
    const examiner1 = tableData.map(data => ({ name: data.examiner1_name, email: data.examiner1_email, contactNo: data.examiner1_contactNo }));
    const examiner2 = tableData.map(data => ({ name: data.examiner2_name, email: data.examiner2_email, contactNo: data.examiner2_contactNo }));

    let str1 = `("${examiner1[0].name}", "${examiner1[0].email}", ${examiner1[0].contactNo})`;
    for (let i = 1; i < examiner1.length; ++i) {
        str1 = `${str1}, ("${examiner1[i].name}", "${examiner1[i].email}", ${examiner1[i].contactNo})`
    }
    await sqlDatabase.execute(`insert into Examiner1 (name,email,contactNo) values ${str1}`);

    let str2 = `("${examiner2[0].name}", "${examiner2[0].email}", ${examiner2[0].contactNo})`;
    for (let i = 1; i < examiner2.length; ++i) {
    }
    str2 = `${str2}, ("${examiner2[i].name}", "${examiner2[i].email}", ${examiner2[i].contactNo})`
    await sqlDatabase.execute(`insert into Examiner2 (name,email,contactNo) values ${str2}`);
}

const postDepartmentTable = async ({ tableData, deptName }) => {
    // auto deletes all associated examiners with help of trigger
    await sqlDatabase.execute(`delete from ExamModule where deptName="${deptName}"`);

    await postExaminers(tableData);

    let str = `("${tableData[0].id}", "${tableData[0].subNomenclature}", "${tableData[0].subCode}", ${tableData[0].template ? `"${tableData[0].template}"` : null}, "${tableData[0].examiner1_email}", "${tableData[0].examiner2_email}", ${tableData[0].syllabus ? `"${tableData[0].syllabus}"` : null},  "${deptName}")`;
    for (let i = 1; i < tableData.length; ++i) {
        str = `${str}, ("${tableData[i].id}", "${tableData[i].subNomenclature}", "${tableData[i].subCode}", ${tableData[i].template ? `"${tableData[i].template}"` : null}, "${tableData[i].examiner1_email}", "${tableData[i].examiner2_email}", ${tableData[i].syllabus ? `"${tableData[i].syllabus}"` : null}, "${deptName}")`
    }
    await sqlDatabase.execute(`insert into ExamModule (id, subNomenclature, subCode, template, examiner1, examiner2, syllabus, deptName ) values ${str}`);
}

const commitRow = async ({ deptName, rowData, memberLoginId }) => {
    // rowData = { id, examiner1_email, examiner1_name, examiner1_contactNo, examiner2_email, examiner2_name, examiner2_contactNo, syllabus }
    await sqlDatabase.execute(`INSERT into Examiner1 (email, name, contactNo) values ('${rowData.examiner1_email}', '${rowData.examiner1_name}', ${rowData.examiner1_contactNo})`);
    await sqlDatabase.execute(`INSERT into Examiner2 (email, name, contactNo) values ('${rowData.examiner2_email}', '${rowData.examiner2_name}', ${rowData.examiner2_contactNo})`);
    await sqlDatabase.execute(`UPDATE ExamModule SET examiner1="${rowData.examiner1_email}", examiner2="${rowData.examiner2_email}", syllabus=${rowData.syllabus} WHERE id="${rowData.id}"`);
    await sqlDatabase.execute(`INSERT INTO Commits (member, examModuleID) values ('${memberLoginId}', '${rowData.id}')`);
}

const initiateApprovalTable = async deptNames => {
    let str = `("${deptNames[0]}", false, false, false)`;
    for (let i = 1; i < deptNames.length; ++i) {
        str = `${str}, ("${deptNames[i]}", false, false, false)`
    }
    await sqlDatabase.execute(`insert into Approval (deptName, sentStatus, approval1, approval2) values ${str}`);
}

const getOverallDeptStatus = async () => {
    const [rows] = await sqlDatabase.execute("select sentStatus from Approval");
    for (let i = 0; i < rows.length; ++i)
        if (rows[i].sentStatus === '0' || rows[i].sentStatus === 0)
            return false;
    return true;
}

const getDeptStatus = async deptName => {
    const [rows] = await sqlDatabase.execute(`select sentStatus from Approval where DeptName="${deptName}"`);
    return rows[0];
}

const getAllDeptStatus = async () => {
    const [rows] = await sqlDatabase.execute("select deptName, sentStatus from Approval");
    return rows;
}

const postDeptStatus = async deptName => {
    await sqlDatabase.execute(`update Approval set sentStatus=true where deptName="${deptName}"`);
}

const getApproval1 = async deptName => {
    const [rows] = await sqlDatabase.execute(`select approval1 from Approval where DeptName="${deptName}"`);
    return rows[0];
}

const getAllApproval1 = async () => {
    const [rows] = await sqlDatabase.execute(`select deptName, approval1 from Approval`);
    return rows;
}

const getAllApproval2 = async () => {
    const [rows] = await sqlDatabase.execute(`select deptName, approval2 from Approval`);
    return rows;
}


const getOverallApproval1 = async () => {
    const [rows] = await sqlDatabase.execute("select approval1 from Approval");
    for (let i = 0; i < rows.length; ++i)
        if (rows[i].approval1 === '0' || rows[i].approval1 === 0)
            return false;
    return true;
}


const putApproval1 = async deptName => {
    await sqlDatabase.execute(`update Approval set approval1=true where deptName="${deptName}"`);
}

const getApproval2 = async deptName => {
    const [rows] = await sqlDatabase.execute(`select approval2 from Approval where DeptName="${deptName}"`);
    return rows[0];
}

const getOverallApproval2 = async () => {
    const [rows] = await sqlDatabase.execute("select approval2 from Approval");
    for (let i = 0; i < rows.length; ++i)
        if (rows[i].approval2 === '0' || rows[i].approval2 === 0)
            return false;
    return true;
}


const putApproval2 = async deptName => {
    await sqlDatabase.execute(`update Approval set approval2=true where deptName="${deptName}"`);
}

const getExcellSheet = async () => {
    const [rows] = await sqlDatabase.execute(`select id, subNomenclature, subCode, examCode,template, 
    examiner1 as examiner1_email, examiner1.Name as examiner1_name, examiner1.ContactNo as examiner1_contactNo, 
    examiner2 as examiner2_email, examiner2.Name as examiner2_name, examiner2.ContactNo as examiner2_contactNo, 
    syllabus, deptName 
    FROM exammodule 
    LEFT JOIN examiner1 on exammodule.examiner1=examiner1.email 
    LEFT JOIN examiner2 on exammodule.examiner2=examiner2.email`);
    return rows;
}

const clearDatabase = async () => {
    await sqlDatabase.execute("delete from Commits");
    await sqlDatabase.execute("delete from Examiner1");
    await sqlDatabase.execute("delete from Examiner2");
    await sqlDatabase.execute("delete from ExamModule");
    await sqlDatabase.execute("update Approval SET sentStatus=false,  approval1=false, approval2=false");
}

const getAllExaminers = async () => {
    const [rows1] = await sqlDatabase.execute("Select * from Examiner1");
    const [rows2] = await sqlDatabase.execute("Select * from Examiner2");
    return [...rows1, ...rows2];
}

module.exports = {
    connectDB,
    User: { createNewUser, getUserById, deleteUser },
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers, getDepartmentTable,
    postDepartmentTable, commitRow, getDeptStatus,
    postDeptStatus, getApproval1, putApproval1,
    getApproval2, putApproval2, getExcellSheet,
    clearDatabase, getAllExaminers, initiateApprovalTable,
    getDepartmentTableWithoutCommits, getOverallDeptStatus,
    getOverallApproval1, getOverallApproval2, getAllDeptStatus,
    getAllApproval1, getAllApproval2
}

