const express = require('express'); 

const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/signup', authController.getSignup ); // 원래 여기에 익명함수 지정하지만 mvc 패턴 사용

router.get('/login', authController.getLogin );

module.exports = router;