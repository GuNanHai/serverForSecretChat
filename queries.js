const Pool = require('pg').Pool
const pool = new Pool({
  user: 'secret_chat',
  host: '127.0.0.1',
  database: 'secret_chat',
  password: '123456789',
  port: 5432,
})

const updateUserMessage = (req,res) => {
	let reqIp = req.clientIp.substring(7, );

	let reqArray = req.body.data.localText;
	let idList = reqArray.map(each=>each.textID);


	pool.query(`SELECT * FROM chattext ORDER BY id DESC LIMIT  25 `,(err, results) => {
		  if(err){
		  	throw err;
		  }


		let sendTextTemp = results.rows.filter(each=>!idList.includes(each.id) && each.ipaddress!==reqIp);
		sendTextTemp = sendTextTemp.reverse();


	    let sendText = sendTextTemp.map(each=>{
	            return {
	                            textID:each.id,
	                            text:each.message,
	                            address:'remote',
	                            ipAddress:each.ipaddress,
	                            datetime:each.datetime,
                                    nickname:each.nickname
	            }
	    })


	  	res.status(200).json(sendText);
	})	
}

const addItem = (req,res) => {
    let text = req.body.chatText.text;
    let nickname = req.body.chatText.nickname;
    let datetime = req.body.chatText.datetime;

    columnNames = ['message','ipaddress','datetime'];
    insertValues = [text,req.clientIp.substring(7, ),datetime];
	

	let dollarSymbol = '';
	let count = 1;
	columnNames = columnNames.reduce((acum,each)=>{
		dollarSymbol= dollarSymbol+'$'+count+',';
		count++;
		return (acum+each+',');
	},'');
	
	columnNames = columnNames.substring(0,columnNames.length-1);
	dollarSymbol = dollarSymbol.substring(0,dollarSymbol.length-1);
	const insertQuery = `INSERT INTO chattext(${columnNames}) VALUES(${dollarSymbol}) RETURNING id`;
	pool.query(insertQuery,insertValues,(err, results) => {
	  if(err){
	  	throw err;
	  }
    let sendText = {
    		textID:results.rows[0].id,
            text:insertValues[0],
            address:'local',
            ipAddress: insertValues[1],
            datetime:insertValues[2],
	    nickname:nickname
    }

    res.status(200).json(sendText);

	})
	  

}

const register = (req,res) => {
	const username = req.body.userinfo.username;
	const password = req.body.userinfo.password;
	const nickname = req.body.userinfo.nickname;
	
	const insertQuery = `INSERT INTO userinfo(username,password,nickname) VALUES($1,$2,$3) RETURNING nickname`;
	const insertValues = [username,password,nickname];
	pool.query(insertQuery,insertValues,(err,results) => {
		if(err){
			throw err;	
		}
		let resObject = {
			nickname:results.rows[0].nickname
		}
		res.status(200).json(resObject);
	})
}

const login = (req,res) => {
	const usernameLogin = req.body.userLogin.username;
	const passwordLogin = req.body.userLogin.password;
	
	const loginQuery = `select * from userinfo where username='${usernameLogin}'`;
	pool.query(loginQuery,(err,results) => {
		if(results.rows[0]===undefined){
			res.status(200).json({loginStatus:'wrongUsername'});
		}else if(results.rows[0].password !==  passwordLogin){
			res.status(200).json({loginStatus:'wrongPassword'});
		}else{
			res.status(200).json({
	                        loginStatus:'success',
	                        nickname:results.rows[0].nickname
	                });
		}	
	})
	
	res.status(200);
}

module.exports = {
	updateUserMessage,
	addItem,
	register,
	login
}







