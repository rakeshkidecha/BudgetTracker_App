const mongoose = require('mongoose');

const IncomeSchema = mongoose.Schema({
    income:{
        type:Number,
        required : true
    },
    date:{
        type : String,
        required : true
    },
    source : {
        type : String,
        required : true
    },
    userId : {
        type :String,
        required : true
    }
})

const Income = mongoose.model('Income',IncomeSchema);
module.exports = Income;