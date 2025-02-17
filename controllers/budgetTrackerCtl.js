const Expense = require('../models/ExpenseModel');
const Income = require('../models/IncomeModel');
const Crypter = require('cryptr');
const cryptr =new Crypter("secretkeybhgdjfgdsjfk")

module.exports.budget = async (req,res)=>{
    try {
        if(!req.cookies.user){
            console.log("Plaese login first..");
            return res.redirect('/');
        }

        const loginUser = JSON.parse(cryptr.decrypt(req.cookies.user));
        // get all year 
        const incomeData = await Income.find({userId:loginUser._id});
        const expenseData = await Expense.find({userId:loginUser._id});
        const allIncomeYears = incomeData.map((item,i)=>new Date(item.date).getFullYear());
        const allExpenseYears = expenseData.map((item,i)=>new Date(item.date).getFullYear());
        const allYears = allIncomeYears.concat(allExpenseYears);
        const years = allYears.filter((item,i)=>allYears.indexOf(item)===i).sort();

        let month ;
        let year;
        if(req.cookies.year && req.cookies.month){
            month = parseInt(req.cookies.month);
            year = parseInt(req.cookies.year);
        }else{
            month = new Date().getMonth();
            year = new Date().getFullYear();
        }

        const startOfMonth = new Date(year,month,1).toISOString();
        let endOfMonth;
        if(month == 11){
            endOfMonth = new Date(year,month,31).toISOString();
        }else{
            endOfMonth = new Date(year,month+1,0).toISOString();
        }


        const allIncome = await Income.find({
            userId:loginUser._id,
            date:{$gte:startOfMonth,$lte:endOfMonth}
        });

        const allExpense = await Expense.find({
            userId:loginUser._id,
            date:{$gte:startOfMonth,$lte:endOfMonth}
        });


        // income details 
        const totalIncome = (allIncome && allIncome.length) > 0 ? allIncome.reduce((a,b)=> a + parseInt(b.income) , 0):0;
        const incomeLable = allIncome.map((item)=>item.source);
        const incomeValue = allIncome.map((item)=>item.income);

        // expense details 
        const totalExpense = (allExpense && allExpense.length) > 0 ? allExpense.reduce((a,b)=> a + parseInt(b.price) , 0):0;
        const lableNames = allExpense.map((item)=>item.title);
        const priceValue = allExpense.map((item)=>item.price);


        return res.render('budget/budget',{
            loginUser,
            allIncome,
            totalIncome,
            incomeLable,
            incomeValue,
            totalExpense,
            allExpense,
            lableNames,
            priceValue,
            years
        });

    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.addIncome = async(req,res)=>{
    try {
        const loginUser = JSON.parse(cryptr.decrypt(req.cookies.user));
        req.body.userId = loginUser._id;

        const addedIncome =  await Income.create(req.body);
        
        if(addedIncome){
            console.log("Income Added successfully");
            return res.redirect('back');
        }else{
            console.log("Faild To Add income");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

// delete income 
module.exports.deleteIncome = async (req,res)=>{
    try {
        const deletedIncomeData = await Income.findByIdAndDelete(req.params.id);
        if(deletedIncomeData){
            console.log("Income Data deleted successfully..");
            return res.redirect('back');
        }else{
            console.log("Faild to delete incom data..");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

// edit income 
module.exports.editIncome = async(req,res)=>{
    try {
        const updatedIncomeData = await Income.findByIdAndUpdate(req.body.id,req.body);
        if(updatedIncomeData){
            console.log("Income Data updated successfully..");
            return res.redirect('back');
        }else{
            console.log("Faild to update income data...");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

// add expense 
module.exports.addExpense = async(req,res)=>{
    try {
        const loginUser = JSON.parse(cryptr.decrypt(req.cookies.user));
        req.body.userId = loginUser._id;

        const addedExpense = await Expense.create(req.body);
        if(addedExpense){
            console.log("Expense Added Successfully..");
            return res.redirect('back');
        }else{
            console.log("Faild to Add Expense");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.deleteExpense = async (req,res)=>{
    try {

        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

        if(deletedExpense){
            console.log("Expense deleted..");
            return res.redirect('back');
        }else{
            console.log("Faild to delete Expense");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.editExpense = async (req,res)=>{
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.body.id,req.body);
        if(updatedExpense){
            console.log("Expense Update successfully..");
            return res.redirect('back');
        }else{
            console.log("Faild to Update Expense");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}


module.exports.filterByYears = async (req,res)=>{
    try {
        if(!req.cookies.user){
            console.log("Plaese login first..");
            return res.redirect('/');
        }

        const loginUser = JSON.parse(cryptr.decrypt(req.cookies.user));
        
        const filterIncome = await Income.find({userId:loginUser._id})
        const filterYearIncomeData = filterIncome.filter((item)=> new Date(item.date).getFullYear() == req.params.year);

        const filterExpense = await Expense.find({userId:loginUser._id})
        const filterYearExpenseData = filterExpense.filter((item)=> new Date(item.date).getFullYear() == req.params.year);
        // total of the year income end expense 
        const totalYearIncome = filterYearIncomeData.reduce((a,b)=>a+parseInt(b.income),0);
        const totalYearExpense = filterYearExpenseData.reduce((a,b)=>a+parseInt(b.price),0);

        let saprateMonthData = [];
        for(let i=0;i<=11;i++){
            const monthIncomeDta = filterYearIncomeData.filter((item)=>new Date(item.date).getMonth()==i);
            const monthExpenseData = filterYearExpenseData.filter((item)=>new Date(item.date).getMonth()==i)
            const totalMonthIncome = monthIncomeDta.reduce((a,b)=>a+parseInt(b.income),0);
            const totalMonthExpense = monthExpenseData.reduce((a,b)=>a+parseInt(b.price),0);
            if(monthExpenseData != 0 || totalMonthIncome != 0){
                saprateMonthData.push({month:i,totalMonthIncome,totalMonthExpense});
            }
        }


        return res.render('budget/filterByYears',{
            loginUser,
            years:JSON.parse(req.params.allYears),
            year: req.params.year,
            totalYearIncome,
            totalYearExpense,
            saprateMonthData
        });

    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}


module.exports.filetrByMonth = async(req,res)=>{
    try {

        const loginUser = JSON.parse(cryptr.decrypt(req.cookies.user))

        const year = req.params.year;

        const incomeData = await Income.find();
        const currentyearData = incomeData.filter((item)=>new Date(item.date).getFullYear() == year);
        const allMonths = currentyearData.map((item)=>new Date(item.date).getMonth())

        const months = allMonths.filter((item,i)=>allMonths.indexOf(item)===i);

        console.log(months);

        return res.render('budget/filetrByMonth',{months,year,loginUser})

    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.chedMonthRecord = async(req,res)=>{
    try {
        res.cookie('month',req.params.month);
        res.cookie('year',req.params.year);
        return res.redirect('/budget');
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}


// request from ajax 
module.exports.selectedMonthExpense = async (req,res)=>{
    try {
        const {year,month}=req.params;
        const loginUser = JSON.parse(cryptr.decrypt(req.cookies.user))
        const expenseData = await Expense.find({userId:loginUser._id});
        const yearExpense = expenseData.filter((item)=>new Date(item.date).getFullYear() == year);
        const monthExpense = yearExpense.filter((item)=>new Date(item.date).getMonth() == month);
        return res.json(monthExpense);
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}

module.exports.selectedMonthIncome = async (req,res)=>{
    try {
        const {year,month}= req.params;
        const loginUser = JSON.parse(cryptr.decrypt(req.cookies.user))
        const incomeData = await Income.find({userId:loginUser._id});
        const yearIncome = incomeData.filter((item)=>new Date(item.date).getFullYear() == year);
        const monthIncome = yearIncome.filter((item)=>new Date(item.date).getMonth() == month);
        return res.json(monthIncome);
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back');
    }
}