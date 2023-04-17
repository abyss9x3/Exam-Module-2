const express = require('express');
const router = express.Router();
const { loggingMiddleware } = require('../middlewares');
const {
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers, getDepartmentTable,
    postDepartmentTable, commitRow, getDeptStatus,
    postDeptStatus, getApproval1, putApproval1,
    getApproval2, putApproval2, getExcellSheet, clearDatabase
} = require('../controllers/explore');

// /api/explore
router
    .get('/deptNames', loggingMiddleware, getDeptNames)
    .post('/deptNames', loggingMiddleware, postDeptNames)

    .get('/deptTableWithoutExaminers', loggingMiddleware, getDeptTableWithoutExaminers)
    .post('/deptTableWithoutExaminers', loggingMiddleware, postDeptTableWithoutExaminers)

    .get('/departmentTable', loggingMiddleware, getDepartmentTable)
    .post('/departmentTable', loggingMiddleware, postDepartmentTable)

    .post('/commitRow', loggingMiddleware, commitRow)

    .get('/deptStatus', loggingMiddleware, getDeptStatus)
    .post('/deptStatus', loggingMiddleware, postDeptStatus)

    .get('/approval1', loggingMiddleware, getApproval1)
    .put('/approval1', loggingMiddleware, putApproval1)

    .get('/approval2', loggingMiddleware, getApproval2)
    .put('/approval2', loggingMiddleware, putApproval2)

    .get('/excellSheet', loggingMiddleware, getExcellSheet)

    .delete('/', loggingMiddleware, clearDatabase);

module.exports = router;
