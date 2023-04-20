const database = require('../database');
const { sendApprovalLetters } = require('../mail');

const data_exporter = require('json2csv').Parser;

const getDeptNames = async (req, res) => {
    try {
        const deptNames = await database.getDeptNames();
        res.status(200).json(deptNames);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const postDeptNames = async (req, res) => {
    try {
        if (!req.body || !req.body.deptNames) {
            res.status(400).json("deptNames array is missing from the req body !");
        }
        await database.postDeptNames(req.body.deptNames);
        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getDeptTableWithoutExaminers = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            res.status(400).json("deptName is missing from the req query !");
        }
        const deptTableData = await database.getDeptTableWithoutExaminers(req.query.deptName);
        res.status(200).json(deptTableData);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const postDeptTableWithoutExaminers = async (req, res) => {
    try {
        if (!req.body || !req.body.tableData || !req.body.deptName) {
            res.status(400).json("deptName or tableData is missing from the req body !");
        }
        await database.postDeptTableWithoutExaminers({ tableData: req.body.tableData, deptName: req.body.deptName });
        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getDepartmentTable = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            res.status(400).json("deptName is missing from the req query !");
        }
        const deptTable = await database.getDepartmentTable(req.query.deptName);
        res.status(200).json(deptTable);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}


const postDepartmentTable = async (req, res) => {
    try {
        if (!req.body || !req.body.tableData || !req.body.deptName) {
            res.status(400).json("deptName or tableData is missing from the req body !");
        }
        await database.postDepartmentTable({ tableData: req.body.tableData, deptName: req.body.deptName });
        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getDepartmentTableWithoutCommits = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            res.status(400).json("deptName is missing from the req query !");
        }
        const deptTable = await database.getDepartmentTableWithoutCommits(req.query.deptName);
        res.status(200).json(deptTable);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const commitRow = async (req, res) => {
    try {
        if (!req.body || !req.body.rowData || !req.body.deptName) {
            res.status(400).json("deptName or rowData is missing from the req body !");
        }
        await database.commitRow({
            rowData: req.body.rowData,
            deptName: req.body.deptName,
            memberLoginId: req.loginid,
            memberName: req.name
        });
        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getDeptStatus = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            res.status(400).json("deptName is missing from the req query !");
        }
        const deptStatus = await database.getDeptStatus(req.query.deptName);
        res.status(200).json(deptStatus);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const postDeptStatus = async (req, res) => {
    try {
        if (!req.body || !req.body.deptName) {
            res.status(400).json("deptName is missing from the req body !");
        }
        await database.postDeptStatus(req.body.deptName);
        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getApproval1 = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            res.status(400).json("deptName is missing from the req query !");
        }
        const deptApproval1 = await database.getApproval1(req.query.deptName);
        res.status(200).json(deptApproval1);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const putApproval1 = async (req, res) => {
    try {
        if (!req.body || !req.body.deptName) {
            res.status(400).json("deptName is missing from the req body !");
        }
        await database.putApproval1(req.body.deptName);
        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getApproval2 = async (req, res) => {
    try {
        if (!req.query || !req.query.deptName) {
            res.status(400).json("deptName is missing from the req query !");
        }
        const deptApproval2 = await database.getApproval2(req.query.deptName);
        res.status(200).json(deptApproval2);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const putApproval2 = async (req, res) => {
    try {
        if (!req.body || !req.body.deptName) {
            res.status(400).json("deptName is missing from the req body !");
        }
        await database.putApproval2(req.body.deptName);

        const allExaminers = await database.getAllExaminers();
        await sendApprovalLetters(allExaminers);

        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
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
        res.status(200).send(csv_data);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const clearDatabase = async (req, res) => {
    try {
        await database.clearDatabase();
        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

module.exports = {
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers, getDepartmentTable,
    postDepartmentTable, commitRow, getDeptStatus,
    postDeptStatus, getApproval1, putApproval1,
    getApproval2, putApproval2, getExcellSheet, clearDatabase,
    getDepartmentTableWithoutCommits
}
