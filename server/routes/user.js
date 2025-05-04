const express = require('express');
const router = express.Router();
const {
    loginValidator, registerValidator,
    deleteUserValidator, loggingMiddleware, authValidator, authorizationHandler
} = require('../middlewares');
const {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    deleteUserController
} = require('../controllers/user');
const { ADMIN } = require('../database/types');

// /api/user
router.post('/login', loggingMiddleware, loginValidator, loginController);
router.post('/register', loggingMiddleware, authValidator, authorizationHandler([ADMIN]), registerValidator, registerController);
router.get('/logout', loggingMiddleware, logoutController);
router.get('/loggedIn', loggingMiddleware, loggedInController);
router.delete('/', loggingMiddleware, authValidator, authorizationHandler([ADMIN]), deleteUserController);

module.exports = router;
