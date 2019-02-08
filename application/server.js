const express       = require('express');
const bodyParser    = require('body-parser')
const path          = require('path');
const mongoose      = require('mongoose');
const cookieParser  = require('cookie-parser');

const app  = express();
const PORT = process.env.PORT || 5000;

const userCheck  = require('./userCheck.js');
const auth       = require('./auth.js');
const static     = require('./static.js');
const api        = require('./api.js');
//const mongoDB = process.env.MONGODB_URI || 'http://localhost:27017';
const mongoDB    = 'mongodb://localhost:27017';
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


app.get('/', (req, res) => {
	console.log( " hit")
	res.send({'res':'Server running'})
});

app.use(auth);
app.use(userCheck);
app.use(static);
app.use(api);
//app.use('/home', express.static(path.join(__dirname, "..", "/dist")))


app.listen(PORT, () => 
	console.log('app is runnning on port 5000')
);