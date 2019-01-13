const express = require('express');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(requestIp.mw()) /*解码用户IP*/
app.use(bodyParser.urlencoded({extended:false}));  /*解码传统urlForm*/
app.use(bodyParser.json());/*解码JSON数据*/
app.use(cors());        /*用于跨域名request*/

let chatText = [];
let textID = 0;



app.post('/getText',(req,res)=>{
        
        let reqArray = req.body.data.localText;
        let reqTextID = reqArray.map(each=>each.textID);
        let sendTextTemp = chatText.filter(each=>!reqTextID.includes(each.textID))
        let sendText = sendTextTemp.map(each=>{
                return {
                                textID:each.textID,
                                text:each.text,
                                address:'remote',
                                ipAddress:each.ipAddress,
                                datetime:each.datetime
                }
        })
        res.send(sendText);

})

app.post('/chatText',(req,res)=>{
        if(chatText.length>20){
                chatText.shift();
        }

        let text = req.body.chatText.text;
        let datetime = req.body.chatText.datetime;
        textID++;
        chatText.push({
                textID:textID,
                text:text,
                ipAddress:req.clientIp.substring(7, ),
                datetime:datetime
        })
        let sendText = {
                textID:textID,
                text:text,
                address:'local',
                ipAddress: req.clientIp.substring(7, ),
                datetime:datetime
        }

        res.send(JSON.stringify(sendText));

})

app.listen(5000);

