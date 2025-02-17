const express = require('express');
const AuthCtl = require('../controllers/authCtl');
const router = express.Router();

router.get('/',AuthCtl.login);

router.post('/loginUser',AuthCtl.loginUser);

router.get('/signUp',AuthCtl.signUp);

router.post('/signUpUser',AuthCtl.signUpUser);

router.get('/logout',AuthCtl.logout);

// forget password 
router.get('/checkEmail',AuthCtl.checkEmail);
router.post('/verifyEmail',AuthCtl.verifyEmail);

router.get('/checkOtp',AuthCtl.checkOtp);
router.post('/verifyOtp',AuthCtl.verifyOtp);

router.get('/forgetPassword',AuthCtl.forgetPassword);
router.post('/setNewPassword',AuthCtl.setNewPassword);

router.use('/budget',require('./budgetTrackerRoutes'));

module.exports = router;