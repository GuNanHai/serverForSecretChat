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
	                            datetime:each.datetime
	            }
	    })


	  	res.status(200).json(sendText);
	})	
}

const addItem = (req,res) => {
    let text = req.body.chatText.text;
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
            datetime:insertValues[2]
    }

    res.status(200).json(sendText);

	})
	  

}




module.exports = {
	updateUserMessage,
	addItem,
}







