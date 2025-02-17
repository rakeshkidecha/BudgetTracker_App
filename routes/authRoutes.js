const express = require('express');
const AuthCtl = require('../controllers/authCtl');
const { check } = require('express-validator');
const User = require('../models/UserModel');
const router = express.Router();

router.get('/',AuthCtl.login);

router.post('/loginUser',AuthCtl.loginUser);

router.get('/signUp',AuthCtl.signUp);

router.post('/signUpUser',User.uploadImage,[
    check('username').notEmpty().withMessage("Username is required").isLength({min:2}).withMessage('Username Must be 2 Charector'),
    check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('invalid Email').custom(async (value)=>{
        const isExistEmail = await User.findOne({email:value});
        if(isExistEmail){
            throw new Error('This Email is Already Exist');
        }
    }),
    check('password').notEmpty().withMessage('Paaword is Required'),
    check('confirmPassword').notEmpty().withMessage('ConfimPassword is required').custom(async(value,{req})=>{
        if(value != req.body.password){
            throw new Error('Password and Confirm Password not Match');
        }
    })
],AuthCtl.signUpUser);

router.get('/logout',AuthCtl.logout);

// forget password 
router.get('/checkEmail',AuthCtl.checkEmail);
router.post('/verifyEmail',AuthCtl.verifyEmail);

router.get('/checkOtp',AuthCtl.checkOtp);
router.post('/verifyOtp',AuthCtl.verifyOtp);

router.get('/forgetPassword',AuthCtl.forgetPassword);
router.post('/setNewPassword',AuthCtl.setNewPassword);

router.get('/changePassword',AuthCtl.changePassword);
router.post('/checkPassword',AuthCtl.checkPassword);

router.use('/budget',require('./budgetTrackerRoutes'));

module.exports = router;