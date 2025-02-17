const User = require('../models/UserModel');
const Crypter = require('cryptr');
const cryptr =new Crypter("secretkeybhgdjfgdsjfk");
const nodemailer = require('nodemailer');

module.exports.login = async (req,res)=>{
    try {

        if(req.cookies.user){
            return res.redirect('/budget');
        }

        return res.render('auth/login');
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.loginUser = async (req,res)=>{
    try {
        const isExistEmail = await User.find({email:req.body.email}).countDocuments();
        if(isExistEmail != 1){
            console.log("Invalid Email");
            return res.redirect('back');
        }

        const user = await User.findOne({email:req.body.email});
        if(user.password === req.body.password){
            res.cookie('user',cryptr.encrypt(JSON.stringify(user)));
            return res.redirect('/budget');
        }else{
            console.log("Invalid Password");
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
} 

module.exports.signUp = async (req,res)=>{
    try {
        if(req.cookies.user){
            return res.redirect('/budget');
        }

        return res.render('auth/signUp');
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.signUpUser = async (req,res)=>{
    try {
        const isExistEmail = await User.find({email:req.body.email}).countDocuments();
        if(isExistEmail != 0){
            console.log("This Email is Already used please try another one..");
            return res.redirect('back');
        }
        
        if(req.body.password != req.body.confirmPassword){
            console.log("password and confirm password not match..");
            return res.redirect('back');
        }

        const createdUser = await User.create(req.body);

        if(createdUser){
            console.log("User register Successfully..");
            res.cookie('user',cryptr.encrypt(JSON.stringify(createdUser)));
            return res.redirect('/budget');
        }else{
            console.log("faild to create user");
            return res.redirect('back');
        }
        
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.logout = async(req,res)=>{
    try {
        res.clearCookie('user');
        return res.redirect('/');
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

// forget password 
module.exports.checkEmail = async (req,res)=>{
    try {
        if(req.cookies.user){
            return res.redirect('/budget')
        }
        return res.render('auth/checkEmail');
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.verifyEmail = async(req,res)=>{
    try {
        
        const isExistEmail = await User.find({email:req.body.email}).countDocuments();

        if(isExistEmail != 1){
            console.log("Invalid Email");
            return res.redirect('back')
        }

        const userData = await User.findOne({email:req.body.email});
        let OTP = Math.floor(Math.random()*10000);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "workrakesh04@gmail.com",
              pass: "ywwrvwdilynldzyo",
            },
            tls : {
                rejectUnauthorized: false
            }
        });

        const info = await transporter.sendMail({
            from: 'workrakesh04@gmail.com', // sender address
            to: userData.email, // list of receivers
            subject: "Verify OTP", // Subject line
            html: `<p>for forget password your verify Otp is <b>${OTP}</b></p>`, // html body
        });
        
        console.log("Message sent: %s", info.messageId);

        res.cookie('verificationOtp',cryptr.encrypt(JSON.stringify(OTP)),{
            maxAge: 60 * 1000,
            httpOnly: true,
        });
        res.cookie('userEmail',cryptr.encrypt(JSON.stringify(userData.email)));

        return res.redirect('/checkOtp');


    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.checkOtp = async (req,res)=>{
    try {

        let isExistOtp = false;

        if(req.cookies.verificationOtp){
            isExistOtp = true;
        }

        const userEmail = JSON.parse(cryptr.decrypt(req.cookies.userEmail));

        return res.render('auth/checkOtp',{userEmail,isExistOtp});

    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.verifyOtp = async (req,res)=>{
    try {

        if(!req.cookies.verificationOtp){
            console.log("Otp not send or expire..");
            return res.redirect('back')
        }

        const verificationOtp = JSON.parse(cryptr.decrypt(req.cookies.verificationOtp));

        if(req.body.otp == verificationOtp){
            res.clearCookie('verificationOtp');
            return res.redirect('/forgetPassword')
        }else{
            console.log("Invalid Opt..");
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.forgetPassword = async (req,res)=>{
    try {
        if(!req.cookies.userEmail){
            return res.redirect('/');
        }

        return res.render('auth/forgetPassword')
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.setNewPassword = async(req,res)=>{
    try {

        if(req.body.newPassword != req.body.confirmPassword){
            console.log("New and Confirm Password not match..");
            return res.redirect('back')
        }

        const userEmail = JSON.parse(cryptr.decrypt(req.cookies.userEmail));

        const isExistEmail = await User.find({email:userEmail}).countDocuments();

        if(isExistEmail != 1){
            console.log("Email not exist..");
            return res.redirect('back')
        }

        const userData = await User.findOne({email:userEmail});

        const updatePasswordData = await User.findByIdAndUpdate(userData.id,{password : req.body.newPassword});
        
        if(updatePasswordData){
            console.log("Password Forgeted successfully...");
            res.clearCookie('userEmail');
            return res.redirect('/');
        }else{
            console.log("Faild to forget password");
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}