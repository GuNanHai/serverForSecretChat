const express = require('express');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
const fs = require('fs');
const cors = require('cors'); 
const db = require('./queries');

const app = express();
app.use(requestIp.mw())	/*解码用户IP*/
app.use(bodyParser.urlencoded({extended:false}));  /*解码传统urlForm*/
app.use(bodyParser.json());/*解码JSON数据*/
app.use(cors());	/*用于跨域名request*/

const getLastID = (lastID) => {return lastID};


app.post('/getText',db.updateUserMessage);

app.post('/chatText',db.addItem);

app.post('/register',db.register);

app.post('/login',db.login);

app.listen(5000);



