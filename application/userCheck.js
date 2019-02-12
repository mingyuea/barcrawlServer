const path = require('path');

module.exports = function(req, res, next){
	if(req.cookies.uid && req.cookies.uid != "tmp"){
		next();
	}
	else{
		//res.sendFile(path.join(__dirname, "..", "dist", 'auth.html'));
	}
}