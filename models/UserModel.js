const mongoose = require('mongoose');
const moment = require('moment');

const path = require('path');
const imagePath = '/uploads';
const multer = require('multer');

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    profileImage:{
        type:String,
        required :true
    },
    date : {
        type : String,
        default : moment().format('YYYY-MM-DD')
    },
});

const imageStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath));
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+'-'+Math.ceil(1000+Math.random()*10000));
    }
});

userSchema.statics.uploadImage = multer({storage:imageStorage}).single('profileImage');
userSchema.statics.imgPath = imagePath;


const User = mongoose.model('User',userSchema);

module.exports = User;