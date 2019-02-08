module.exports = function(req, res, next){
	if(req.cookies.uid){
		next()
	}
	else{
		res.redirect(403,'/');
	}
}