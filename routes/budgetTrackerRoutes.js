const express = require('express');
const budgetTrackerCtl = require('../controllers/budgetTrackerCtl');

const router = express.Router();

router.get('/',budgetTrackerCtl.budget);

// add income 
router.post('/addIncome',budgetTrackerCtl.addIncome);

// delete Income 
router.get('/deleteIncome/:id',budgetTrackerCtl.deleteIncome); 

// edit Income 
router.post('/editIncome',budgetTrackerCtl.editIncome);

// add expense
router.post('/addExpense',budgetTrackerCtl.addExpense);

// delete expense 
router.get('/deleteExpense/:id',budgetTrackerCtl.deleteExpense);

// edit expense 
router.post('/editExpense',budgetTrackerCtl.editExpense);

router.get('/filterByYears/:year/:allYears',budgetTrackerCtl.filterByYears);

router.get('/filetrByMonth/:year',budgetTrackerCtl.filetrByMonth);

router.get('/chedMonthRecord/:month/:year',budgetTrackerCtl.chedMonthRecord);

// request from ajax 
router.get('/selectedMonthExpense/:year/:month',budgetTrackerCtl.selectedMonthExpense);

router.get('/selectedMonthIncome/:year/:month',budgetTrackerCtl.selectedMonthIncome);

module.exports = router;