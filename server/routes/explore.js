const express = require('express');
const router = express.Router();
const { loggingMiddleware, authValidator, authorizationHandler } = require('../middlewares');
const {
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers, getDepartmentTable,
    postDepartmentTable, commitRow, getDeptStatus,
    postDeptStatus, getApproval1, putApproval1,
    getApproval2, putApproval2, getExcellSheet, clearDatabase,
    getDepartmentTableWithoutCommits
} = require('../controllers/explore');
const { ADMIN, EXAMCONTROLLER, EXAMOFFICER, HOD, MEMBER } = require('../database/types');

// /api/explore
router
    .get('/deptNames', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), getDeptNames)
    .post('/deptNames', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), postDeptNames)

    .get('/deptTableWithoutExaminers', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), getDeptTableWithoutExaminers)
    .post('/deptTableWithoutExaminers', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), postDeptTableWithoutExaminers)

    .get('/departmentTable', loggingMiddleware, authValidator, authorizationHandler([MEMBER, HOD]), getDepartmentTable)
    .post('/departmentTable', loggingMiddleware, authValidator, authorizationHandler([HOD, EXAMOFFICER, EXAMCONTROLLER]), postDepartmentTable)

    .get('/departmentTableWithoutCommits', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), getDepartmentTableWithoutCommits)

    .post('/commitRow', loggingMiddleware, authValidator, authorizationHandler([MEMBER, HOD]), commitRow)

    .get('/deptStatus', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), getDeptStatus)
    .put('/deptStatus', loggingMiddleware, authValidator, authorizationHandler([HOD]), postDeptStatus)

    .get('/approval1', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), getApproval1)
    .put('/approval1', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), putApproval1)

    .get('/approval2', loggingMiddleware, authValidator, authorizationHandler([EXAMCONTROLLER]), getApproval2)
    .put('/approval2', loggingMiddleware, authValidator, authorizationHandler([EXAMCONTROLLER]), putApproval2)

    .get('/excellSheet', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), getExcellSheet)

    .delete('/', loggingMiddleware, authValidator, authorizationHandler([ADMIN]), clearDatabase);

module.exports = router;
