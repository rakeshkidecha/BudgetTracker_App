const mongoose = require('mongoose');
const moment = require('moment')

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
    date : {
        type : String,
        default : moment().format('YYYY-MM-DD')
    },
})


const User = mongoose.model('User',userSchema);

module.exports = User;