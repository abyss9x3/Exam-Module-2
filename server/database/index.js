const mysql = require('mysql2/promise');
const { HOD, MEMBER, EXAMOFFICER, EXAMCONTROLLER } = require('./types');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    waitForConnections: true,
    connectionLimit: 10
});

const connectDB = async () => {
    await pool.query('SELECT 1 + 1 AS solution');
    console.log("Database connected!");
}

const disconnectDB = async () => {
    await pool.end();
    console.log("Database disconnected!");
}

/**
 * @callback Queries
 * @param {mysql.PoolConnection} connection
 * @returns {Promise<>}
 */

/**
 * Executes a transaction by calling the provided queries function with a MySQL connection,
 * and commits or rolls back the transaction based on the success of the queries.
 * 
 * @param {Queries} queries - The queries to execute as a transaction
 * @returns {Promise<void>} - Resolves if the transaction was successful, rejects if it failed
 */
const transactionWrapper = async queries => {
    /** @type {mysql.PoolConnection} */
    let connection = null;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const response = await queries(connection);

        await connection.commit();
        return response;
    } catch (error) {
        if (connection) {
            await connection.rollback();
            throw new Error(error.message);
        } else {
            throw new Error("Failed to get a database connection: " + error.message);
        }
    } finally {
        try {
            if (connection) connection.release();
        } catch (error) {
            throw new Error("Failed to release the database connection: " + error.message);
        }
    }
}

/* ---------------------------------------------------------------------------------------------------------------------------- */

// User - Queries related to login/signup/deleteUser
const createNewUser = ({ name, loginid, password, designation, deptName }) => transactionWrapper(async connection => {
    if (designation === HOD || designation === MEMBER) {
        return await connection.execute(`insert into member(name, loginid, password,  designation, deptname) values ("${name}","${loginid}","${password}","${designation}","${deptName}");`);
    }
    else if (designation === EXAMOFFICER || designation === EXAMCONTROLLER) {
        return await connection.execute(`insert into examoffice(name, loginid, password,  designation, deptname) values ("${name}","${loginid}","${password}","${designation}","${deptName}");`);
    }
    else {
        throw new Error('designation doesnot exist');
    }
});

const getUserById = async loginid => transactionWrapper(async connection => {
    const [rowsem] = await connection.execute(`select * from ExamOffice where loginid="${loginid}"`);
    const [rowM] = await connection.execute(`select * from Member where loginid="${loginid}"`);

    if (!rowM.length && rowsem.length) return rowsem[0];
    else if (!rowsem.length && rowM.length) return rowM[0];
    else return null;
});


const deleteUser = async ({ loginid, designation }) => transactionWrapper(async connection => {
    if (designation === HOD || designation === MEMBER) {
        await connection.execute(`delete from Member where loginid = "${loginid}"`);
    }
    else if (designation === EXAMOFFICER || designation === EXAMCONTROLLER) {
        await connection.execute(`delete from ExamOffice where loginid = "${loginid}"`);
    }
});

// all other database queries
const getDeptNames = async () => transactionWrapper(async connection => {
    const [rows] = await connection.execute("select * from examsubcommittee");
    return rows.map(ele => ele.deptName);
});

const postDeptNames = async deptNames => transactionWrapper(async connection => {
    await connection.execute(`delete from examsubcommittee`);

    let str = `("${deptNames[0]}")`;
    for (let i = 1; i < deptNames.length; ++i) {
        str = `${str}, ("${deptNames[i]}")`
    }
    await connection.execute(`insert into examsubcommittee values ${str}`);
});

const getDeptTableWithoutExaminers = async deptName => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`select id, subNomenclature, subCode, template from ExamModule where deptName="${deptName}"`)
    return rows;
});

const postDeptTableWithoutExaminers = async ({ tableData, deptName }) => transactionWrapper(async connection => {
    // tableData = [ { id, subNomenclature, subCode, template } ]
    let str = `("${tableData[0].id}", "${tableData[0].subNomenclature}", "${tableData[0].subCode}", ${tableData[0].template ? `"${tableData[0].template}"` : null}, "${deptName}")`;
    for (let i = 1; i < tableData.length; ++i) {
        str = `${str}, ("${tableData[i].id}", "${tableData[i].subNomenclature}", "${tableData[i].subCode}", ${tableData[i].template ? `"${tableData[i].template}"` : null}, "${deptName}")`
    }
    await connection.execute(`delete from ExamModule where DeptName="${deptName}"`);
    await connection.execute(`insert into ExamModule (id, subNomenclature, subCode, template, DeptName) values ${str}`);
});

const getDepartmentTable = async deptName => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`
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
});

const getDepartmentTableWithoutCommits = async deptName => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`
    SELECT id, subNomenclature, subCode, template, syllabus, deptName,
    examiner1 as examiner1_email, examiner1.Name as examiner1_name, examiner1.ContactNo as examiner1_contactNo, 
    examiner2 as examiner2_email, examiner2.Name as examiner2_name, examiner2.ContactNo as examiner2_contactNo FROM exammodule 
    LEFT JOIN examiner1 on exammodule.examiner1=examiner1.email
    LEFT JOIN examiner2 on exammodule.examiner2=examiner2.email
    where deptName = '${deptName}' `);
    return rows;
});

const postExaminers = async tableData => transactionWrapper(async connection => {
    const examiner1 = tableData.map(data => ({ name: data.examiner1_name, email: data.examiner1_email, contactNo: data.examiner1_contactNo }));
    const examiner2 = tableData.map(data => ({ name: data.examiner2_name, email: data.examiner2_email, contactNo: data.examiner2_contactNo }));

    let str1 = `("${examiner1[0].name}", "${examiner1[0].email}", ${examiner1[0].contactNo})`;
    for (let i = 1; i < examiner1.length; ++i) {
        str1 = `${str1}, ("${examiner1[i].name}", "${examiner1[i].email}", ${examiner1[i].contactNo})`
    }
    await connection.execute(`insert into Examiner1 (name,email,contactNo) values ${str1}`);

    let str2 = `("${examiner2[0].name}", "${examiner2[0].email}", ${examiner2[0].contactNo})`;
    for (let i = 1; i < examiner2.length; ++i) {
    }
    str2 = `${str2}, ("${examiner2[i].name}", "${examiner2[i].email}", ${examiner2[i].contactNo})`
    await connection.execute(`insert into Examiner2 (name,email,contactNo) values ${str2}`);
});

const postDepartmentTable = async ({ tableData, deptName }) => transactionWrapper(async connection => {
    // auto deletes all associated examiners with help of trigger
    // TODO: delete details of commit table also and if required re-enter
    await connection.execute(`delete from ExamModule where deptName="${deptName}"`);

    await postExaminers(tableData);

    let str = `("${tableData[0].id}", "${tableData[0].subNomenclature}", "${tableData[0].subCode}", ${tableData[0].template ? `"${tableData[0].template}"` : null}, "${tableData[0].examiner1_email}", "${tableData[0].examiner2_email}", ${tableData[0].syllabus ? `"${tableData[0].syllabus}"` : null},  "${deptName}")`;
    for (let i = 1; i < tableData.length; ++i) {
        str = `${str}, ("${tableData[i].id}", "${tableData[i].subNomenclature}", "${tableData[i].subCode}", ${tableData[i].template ? `"${tableData[i].template}"` : null}, "${tableData[i].examiner1_email}", "${tableData[i].examiner2_email}", ${tableData[i].syllabus ? `"${tableData[i].syllabus}"` : null}, "${deptName}")`
    }
    await connection.execute(`insert into ExamModule (id, subNomenclature, subCode, template, examiner1, examiner2, syllabus, deptName ) values ${str}`);
});

const commitRow = async ({ rowData, memberLoginId }) => transactionWrapper(async connection => {
    // rowData = { id, examiner1_email, examiner1_name, examiner1_contactNo, examiner2_email, examiner2_name, examiner2_contactNo, syllabus }
    await connection.execute(`INSERT into Examiner1 (email, name, contactNo) values ('${rowData.examiner1_email}', '${rowData.examiner1_name}', ${rowData.examiner1_contactNo})`);
    await connection.execute(`INSERT into Examiner2 (email, name, contactNo) values ('${rowData.examiner2_email}', '${rowData.examiner2_name}', ${rowData.examiner2_contactNo})`);
    await connection.execute(`UPDATE ExamModule SET examiner1="${rowData.examiner1_email}", examiner2="${rowData.examiner2_email}", syllabus=${rowData.syllabus ? `"${rowData.syllabus}"` : null} WHERE id="${rowData.id}"`);
    await connection.execute(`INSERT INTO Commits (member, examModuleID) values ('${memberLoginId}', '${rowData.id}')`);
});

const initiateApprovalTable = async deptNames => transactionWrapper(async connection => {
    let str = `("${deptNames[0]}", false, false, false)`;
    for (let i = 1; i < deptNames.length; ++i) {
        str = `${str}, ("${deptNames[i]}", false, false, false)`
    }
    await connection.execute(`insert into Approval (deptName, sentStatus, approval1, approval2) values ${str}`);
});

const getOverallDeptStatus = async () => transactionWrapper(async connection => {
    const [rows] = await connection.execute("select sentStatus from Approval");
    for (let i = 0; i < rows.length; ++i)
        if (rows[i].sentStatus === '0' || rows[i].sentStatus === 0)
            return false;
    return true;
});

const getDeptStatus = async deptName => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`select sentStatus from Approval where DeptName="${deptName}"`);
    return rows[0];
});

const getAllDeptStatus = async () => transactionWrapper(async connection => {
    const [rows] = await connection.execute("select deptName, sentStatus from Approval");
    return rows;
});

const postDeptStatus = async deptName => transactionWrapper(async connection => {
    await connection.execute(`update Approval set sentStatus=true where deptName="${deptName}"`);
});

const getApproval1 = async deptName => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`select approval1 from Approval where DeptName="${deptName}"`);
    return rows[0];
});

const getAllApproval1 = async () => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`select deptName, approval1 from Approval`);
    return rows;
});

const getAllApproval2 = async () => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`select deptName, approval2 from Approval`);
    return rows;
});


const getOverallApproval1 = async () => transactionWrapper(async connection => {
    const [rows] = await connection.execute("select approval1 from Approval");
    for (let i = 0; i < rows.length; ++i)
        if (rows[i].approval1 === '0' || rows[i].approval1 === 0)
            return false;
    return true;
});


const putApproval1 = async deptName => transactionWrapper(async connection => {
    await connection.execute(`update Approval set approval1=true where deptName="${deptName}"`);
});

const getApproval2 = async deptName => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`select approval2 from Approval where DeptName="${deptName}"`);
    return rows[0];
});

const getOverallApproval2 = async () => transactionWrapper(async connection => {
    const [rows] = await connection.execute("select approval2 from Approval");
    for (let i = 0; i < rows.length; ++i)
        if (rows[i].approval2 === '0' || rows[i].approval2 === 0)
            return false;
    return true;
});


const putApproval2 = async deptName => transactionWrapper(async connection => {
    await connection.execute(`update Approval set approval2=true where deptName="${deptName}"`);
});

const getExcellSheet = async () => transactionWrapper(async connection => {
    const [rows] = await connection.execute(`select id, subNomenclature, subCode, examCode, template, 
    examiner1 as examiner1_email, examiner1.Name as examiner1_name, examiner1.ContactNo as examiner1_contactNo, 
    examiner2 as examiner2_email, examiner2.Name as examiner2_name, examiner2.ContactNo as examiner2_contactNo, 
    syllabus, deptName 
    FROM exammodule 
    LEFT JOIN examiner1 on exammodule.examiner1=examiner1.email 
    LEFT JOIN examiner2 on exammodule.examiner2=examiner2.email`);
    return rows;
});

const clearDatabase = async () => transactionWrapper(async connection => {
    await connection.execute("delete from Commits");
    await connection.execute("delete from Examiner1");
    await connection.execute("delete from Examiner2");
    await connection.execute("delete from ExamModule");
    await connection.execute("update Approval SET sentStatus=false,  approval1=false, approval2=false");
});

const getAllExaminers = async () => transactionWrapper(async connection => {
    const [rows1] = await connection.execute("Select * from Examiner1");
    const [rows2] = await connection.execute("Select * from Examiner2");
    return [...rows1, ...rows2];
});

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
    getAllApproval1, getAllApproval2, disconnectDB
}
