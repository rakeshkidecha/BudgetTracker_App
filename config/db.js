const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/budgetTracker');

const db = mongoose.connection;

db.once('open',err=>console.log(err?err:"DataBase connected successfully"));

module.exports = db;