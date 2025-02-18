const mongoose = require('mongoose');
const env = require('dotenv').config();

// offline Databse 
// mongoose.connect('mongodb://127.0.0.1:27017/budgetTracker');

// online database
mongoose.connect(process.env.MONGODB_CONNECT_URI);


const db = mongoose.connection;

db.once('open',err=>console.log(err?err:"DataBase connected successfully"));

module.exports = db;