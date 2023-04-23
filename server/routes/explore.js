const express = require('express');
const router = express.Router();
const { loggingMiddleware, authValidator, authorizationHandler, phaseValidator } = require('../middlewares');
const {
    getDeptNames, postDeptNames, getDeptTableWithoutExaminers,
    postDeptTableWithoutExaminers, getDepartmentTable,
    postDepartmentTable, commitRow, getDeptStatus,
    postDeptStatus, getApproval1, putApproval1,
    getApproval2, putApproval2, getExcellSheet, clearDatabase,
    getDepartmentTableWithoutCommits, phase1End, sendAppointmentLetters,
    getAllDeptStatus
} = require('../controllers/explore');
const { ADMIN, EXAMCONTROLLER, EXAMOFFICER, HOD, MEMBER } = require('../database/types');

// /api/explore
router
    .get('/deptNames', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), phaseValidator([1, 2, 3, 4]), getDeptNames)
    .post('/deptNames', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), phaseValidator([1]), postDeptNames)

    .get('/deptTableWithoutExaminers', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), phaseValidator([1]), getDeptTableWithoutExaminers)
    .post('/deptTableWithoutExaminers', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), phaseValidator([1]), postDeptTableWithoutExaminers)

    .post('/phase1end', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), phaseValidator([1]), phase1End)

    .get('/departmentTable', loggingMiddleware, authValidator, authorizationHandler([MEMBER, HOD]), phaseValidator([2]), getDepartmentTable)
    .post('/departmentTable', loggingMiddleware, authValidator, authorizationHandler([HOD, EXAMOFFICER, EXAMCONTROLLER]), phaseValidator([2, 3, 4]), postDepartmentTable)

    .get('/departmentTableWithoutCommits', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), phaseValidator([2, 3, 4]), getDepartmentTableWithoutCommits)

    .post('/commitRow', loggingMiddleware, authValidator, authorizationHandler([MEMBER, HOD]), phaseValidator([2]), commitRow)

    .get('/deptStatus', loggingMiddleware, authValidator, authorizationHandler([HOD, EXAMOFFICER]), getDeptStatus)
    .get('/allDeptStatus', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), getAllDeptStatus)
    .put('/deptStatus', loggingMiddleware, authValidator, authorizationHandler([HOD]), phaseValidator([2]), postDeptStatus)

    .get('/approval1', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), phaseValidator([3]), getApproval1)
    .put('/approval1', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER]), phaseValidator([3]), putApproval1)

    .get('/approval2', loggingMiddleware, authValidator, authorizationHandler([EXAMCONTROLLER]), phaseValidator([4]), getApproval2)
    .put('/approval2', loggingMiddleware, authValidator, authorizationHandler([EXAMCONTROLLER]), phaseValidator([4]), putApproval2)

    .get('/sendAppointmentLetters', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), phaseValidator([5]), sendAppointmentLetters)
    .get('/excellSheet', loggingMiddleware, authValidator, authorizationHandler([EXAMOFFICER, EXAMCONTROLLER]), phaseValidator([5]), getExcellSheet)
    .delete('/', loggingMiddleware, authValidator, authorizationHandler([ADMIN]), phaseValidator([5]), clearDatabase);

module.exports = router;
