const database = require('../database');
const { sendApprovalLetters } = require('../mail');
const data_exporter = require('json2csv').Parser;

const getDeptNames = async (req, res) => {
    try {
        const deptNames = await database.getDeptNames();
        return res.status(200).json(deptNames);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const postDeptNames = async (req, res) => {
    try {
        if (!req.body || !req.body.deptNames) {
            return res.status(400).json("deptNames array is missing from the req body !");
        }
        await database.postDeptNames(req.body.deptNames);
        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getDeptTableWithoutExaminers = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            return res.status(400).json("deptName is missing from the req query !");
        }
        const deptTableData = await database.getDeptTableWithoutExaminers(req.query.deptName);
        return res.status(200).json(deptTableData);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const postDeptTableWithoutExaminers = async (req, res) => {
    try {
        if (!req.body || !req.body.tableData || !req.body.deptName) {
            return res.status(400).json("deptName or tableData is missing from the req body !");
        }
        await database.postDeptTableWithoutExaminers({ tableData: req.body.tableData, deptName: req.body.deptName });
        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getDepartmentTable = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            return res.status(400).json("deptName is missing from the req query !");
        }
        const deptTable = await database.getDepartmentTable(req.query.deptName);
        return res.status(200).json(deptTable);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}


const postDepartmentTable = async (req, res) => {
    try {
        if (!req.body || !req.body.tableData || !req.body.deptName) {
            return res.status(400).json("deptName or tableData is missing from the req body !");
        }
        await database.postDepartmentTable({ tableData: req.body.tableData, deptName: req.body.deptName });
        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getDepartmentTableWithoutCommits = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            return res.status(400).json("deptName is missing from the req query !");
        }
        const deptTable = await database.getDepartmentTableWithoutCommits(req.query.deptName);
        return res.status(200).json(deptTable);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const commitRow = async (req, res) => {
    try {
        if (!req.body || !req.body.rowData || !req.body.deptName) {
            return res.status(400).json("deptName or rowData is missing from the req body !");
        }
        await database.commitRow({
            rowData: req.body.rowData,
            deptName: req.body.deptName,
            memberLoginId: req.loginid,
            memberName: req.name
        });
        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getDeptStatus = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            return res.status(400).json("deptName is missing from the req query !");
        }
        const deptStatus = await database.getDeptStatus(req.query.deptName);
        return res.status(200).json(deptStatus);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getAllDeptStatus = async (req, res) => {
    try {
        const deptStatus = await database.getAllDeptStatus();
        const newarr = {};
        deptStatus.forEach(ele => newarr[ele.deptName] = ele.sentStatus);
        return res.status(200).json(newarr);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}


const postDeptStatus = async (req, res) => {
    try {
        if (!req.body || !req.body.deptName) {
            return res.status(400).json("deptName is missing from the req body !");
        }
        await database.postDeptStatus(req.body.deptName);
        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getApproval1 = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            return res.status(400).json("deptName is missing from the req query !");
        }
        const deptApproval1 = await database.getApproval1(req.query.deptName);
        return res.status(200).json(deptApproval1);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getAllApproval1 = async (req, res) => {
    try {
        const approval1 = await database.getAllApproval1();
        const newobj = {};
        approval1.forEach(ele => newobj[ele.deptName] = ele.approval1);
        return res.status(200).json(newobj);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}


const putApproval1 = async (req, res) => {
    try {
        if (!req.body || !req.body.deptName) {
            return res.status(400).json("deptName is missing from the req body !");
        }
        await database.putApproval1(req.body.deptName);
        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getApproval2 = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            return res.status(400).json("deptName is missing from the req query !");
        }
        const deptApproval2 = await database.getApproval2(req.query.deptName);
        return res.status(200).json(deptApproval2);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const putApproval2 = async (req, res) => {
    try {
        if (!req.body || !req.body.deptName) {
            return res.status(400).json("deptName is missing from the req body !");
        }
        await database.putApproval2(req.body.deptName);

        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const sendAppointmentLetters = async (req, res) => {
    try {
        const allExaminers = await database.getAllExaminers();
        await sendApprovalLetters(allExaminers);

        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}


const getExcellSheet = async (req, res) => {
    try {
        const wholeTableData = await database.getExcellSheet();

        const file_header = ["id", "SubNomenclature", "SubCode", "ExamCode", "Template", "Examiner1_email", "Examiner1_name", "Examiner1_contactno", "Examiner2_email", "Examiner2_name", "Examiner2_contactno", "Syllabus", "deptName"];
        const json_data = new data_exporter({ file_header });
        const mysql_data = JSON.parse(JSON.stringify(wholeTableData));
        const csv_data = json_data.parse(mysql_data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=Exam_Module.csv");
        return res.status(200).send(csv_data);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const clearDatabase = async (req, res) => {
    try {
        await database.clearDatabase();
        return res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

let phase1Ended = false;

const phase1End = async (req, res) => {
    try {
        phase1Ended = true;
        res.status(200).json("Send Successfully ! Phase 1 completed !");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getPhase = async deptName => {
    // checking phase 1
    if (!phase1Ended) return 1;

    // if M or HOD checking for phase 2 and above
    if (deptName) {
        const deptStatus = await database.getDeptStatus(deptName);
        if (deptStatus === 1 || deptStatus === '1') return 3;
        else if (deptStatus === 0 || deptStatus === '0') return 2;
    }

    // if EO, EC checking for phase 2
    const overallStatus = await database.getOverallDeptStatus();
    if (!overallStatus) return 2;

    // checking for phase 3
    const overallApproval1 = await database.getOverallApproval1();
    if (!overallApproval1) return 3;

    // checking for phase 4
    const overallApproval2 = await database.getOverallApproval2();
    if (!overallApproval2) return 4;

    // phases ended !
    return 5;
}

module.exports = {
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers, getDepartmentTable,
    postDepartmentTable, commitRow, getDeptStatus,
    postDeptStatus, getApproval1, putApproval1,
    getApproval2, putApproval2, getExcellSheet, clearDatabase,
    getDepartmentTableWithoutCommits, phase1End,
    getPhase, sendAppointmentLetters, getAllDeptStatus,
    getAllApproval1
}
