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
        // const 
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const getDeptTableWithoutExaminers = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const postDeptTableWithoutExaminers = async (req, res) => {
    try {

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
