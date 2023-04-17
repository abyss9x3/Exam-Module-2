const express = require('express');
const router = express.Router();
const { loggingMiddleware, authValidator } = require('../middlewares');
const {
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers, getDepartmentTable,
    postDepartmentTable, commitRow, getDeptStatus,
    postDeptStatus, getApproval1, putApproval1,
    getApproval2, putApproval2, getExcellSheet, clearDatabase
} = require('../controllers/explore');

// /api/explore
router
    .get('/deptNames', loggingMiddleware, authValidator, getDeptNames)
    .post('/deptNames', loggingMiddleware, authValidator, postDeptNames)

    .get('/deptTableWithoutExaminers', loggingMiddleware, authValidator, getDeptTableWithoutExaminers)
    .post('/deptTableWithoutExaminers', loggingMiddleware, authValidator, postDeptTableWithoutExaminers)

    .get('/departmentTable', loggingMiddleware, authValidator, getDepartmentTable)
    .post('/departmentTable', loggingMiddleware, authValidator, postDepartmentTable)

    .post('/commitRow', loggingMiddleware, authValidator, commitRow)

    .get('/deptStatus', loggingMiddleware, authValidator, getDeptStatus)
    .post('/deptStatus', loggingMiddleware, authValidator, postDeptStatus)

    .get('/approval1', loggingMiddleware, authValidator, getApproval1)
    .put('/approval1', loggingMiddleware, authValidator, putApproval1)

    .get('/approval2', loggingMiddleware, authValidator, getApproval2)
    .put('/approval2', loggingMiddleware, authValidator, putApproval2)

    .get('/excellSheet', loggingMiddleware, authValidator, getExcellSheet)

    .delete('/', loggingMiddleware, authValidator, clearDatabase);

module.exports = router;
