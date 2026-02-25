const express = require('express');
const userController = require('../controllers/user');

const { verify } = require('../auth');

const router = express.Router();

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/details', verify, userController.details)

module.exports = router;