const express       = require('express');
const bodyParser    = require('body-parser')
const path          = require('path');
const mongoose      = require('mongoose');
const cookieParser  = require('cookie-parser');
const cEnc = require('./cookieEncrypt.js');

const app  = express();
const PORT = process.env.PORT || 5000;

const userCheck  = require('./userCheck.js');
const auth       = require('./auth.js');
const static     = require('./static.js');
const api        = require('./api.js');
const search	 = require('./search.js');
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017';
//const mongoDB    = 'mongodb://localhost:27017';

mongoose.connect(mongoDB).then(()=> console.log("DB connected!")).catch(err => {console.log(`Database connection error: ${err}`)});;
//const db = mongoose.connection;


app.use((req, res, next) => {
	res.header("Access-Control-Allow-Header", "Origin, Content-Type")
	res.header("Access-Control-Allow-Credentials", true)
	//res.header("Access-Control-Allow-Origin", "http://localhost:8080")
	next();
})


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser('dev'));

app.use((req, res, next) =>{
	let cookies = req.cookies;
	if(cookies.uid && cookies.uid != "tmp"){
		let uID = cEnc.cookieEncrypt(cookies.uid, false);
		res.locals.uid = uID;
	} else if(cookies.uid == "tmp"){
		res.locals.uid = "tmp";
	}
	next();
});

app.use(search);
app.use(auth);
app.use(static);

app.get('/', (req, res) => {
	if(res.locals.uid){
		if(res.locals.uid == "tmp"){
			res.redirect('/static/tmp');
		}
		else{
			res.redirect('/static/home');
		}
	}
	else{
		res.redirect('/static/auth');
	}
});

//app.use(userCheck);
app.use(api);


app.listen(PORT, () => 
	console.log('app is runnning on port 5000')
);