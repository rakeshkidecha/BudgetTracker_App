const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const port = 8021;
const db = require('./config/db');

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(cookieParser())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname,'assets')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));


app.use('/',require('./routes/authRoutes'));


app.listen(port,err=>console.log(err?err:"Server runing in http://localhost:"+port));