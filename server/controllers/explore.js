const database = require('../database');

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
            res.status(400).json("deptNames array is missing in req body !");
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
            res.status(400).json("deptName is missing in req query !");
        }
        const deptTableData = await database.getDeptTableWithoutExaminers(deptName);
        res.status(200).json(deptTableData);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const postDeptTableWithoutExaminers = async (req, res) => {
    try {
        if (!req.body || !req.body.tableData || !req.body.deptName) {
            res.status(400).json("deptName or tableData is missing in req body !");
        }
        await database.postDeptTableWithoutExaminers({ tableData, deptName });
        res.status(200).json("Done");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getDepartmentTable = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const postDepartmentTable = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const commitRow = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getDeptStatus = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const postDeptStatus = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getApproval1 = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const putApproval1 = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getApproval2 = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const putApproval2 = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getExcellSheet = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const clearDatabase = async (req, res) => {
    try {

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
    getApproval2, putApproval2, getExcellSheet, clearDatabase
}
