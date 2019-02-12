const express = require('express');
const router = express.Router();
const path = require('path');


router.use('/static', express.static(path.join(__dirname, "..", "dist")));

router.get('/static/auth', (req, res) => {
	if(req.cookies.uid && req.cookies.uid != "tmp"){
		res.redirect('/static/home');
	}
	else{
		res.sendFile(path.join(__dirname, "..", "dist", 'auth.html'));
	}
})

router.get('/static/tmp', (req, res) => {
	res.sendFile(path.join(__dirname, "..", "dist", 'tmp.html'));
});

router.use((req, res, next) => {
	if(req.cookies.uid && req.cookies.uid != "tmp"){
		next();
	}
	else{
		res.redirect("/static/auth");
	}
});

router.get('/static/home', (req, res) => {
	res.sendFile(path.join(__dirname, "..", "dist", 'index.html'));
});

module.exports = router;