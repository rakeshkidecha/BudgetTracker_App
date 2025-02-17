const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
    title:{
        type :String,
        required : true
    },
    price:{
        type :String,
        required : true
    },
    date:{
        type :String,
        required : true
    },
    userId : {
        type :String,
        required : true
    }
})

const Expense = mongoose.model('Expense',ExpenseSchema);
module.exports = Expense;