const express = require('express');
const router = express.Router();
const {
    loginValidator, registerValidator,
    deleteUserValidator, loggingMiddleware
} = require('../middlewares');
const {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    deleteUserController
} = require('../controllers/user');

// /api/user
router.post('/login', loggingMiddleware, loginValidator, loginController);
router.post('/register', loggingMiddleware, registerValidator, registerController);
router.get('/logout', loggingMiddleware, logoutController);
router.get('/loggedIn', loggingMiddleware, loggedInController);
router.delete('/', loggingMiddleware, deleteUserValidator, deleteUserController);

module.exports = router;
