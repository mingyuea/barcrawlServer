const express = require('express');
const router = express.Router();
//const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routeSchema = require('../models/RouteModel.js');
const RouteModel = mongoose.model('RouteModel');
const cEnc = require('./cookieEncrypt.js');

//router.use(cookieParser());
router.use((req, res, next) =>{
	let cookies = req.cookies;
	let uID = cEnc.cookieEncrypt(cookies.uid, false);

	req.uid = uID;
	next();
});


router.post('/api/seach', async ())


router.post('/api/createRoute', async (req, res) => {
	let uid = req.uid;
	let myRoute = ['a','b','c'];

	if(uid != "tmp"){
		var newRoute = new RouteModel({
			userID: uid,
			routeArr: myRoute
		});

		newRoute.save((err, doc) => {
			if(err){
				console.log('Database error in saving: '+ err);
			}
		});
		res.send({'actionSuccess': true, 'saved': true});
	}
	res.send({'test':true});
});


router.get('/api/getRoute', async (req, res) => {
	let uid = req.uid;
	console.log('the userid is' + uid);
	if(uid == "tmp"){
		res.send({'actionSuccess': false, 'error': 'You are using a temporary account, your route info was not saved'});
	}
	else{
		let routeArr;
		try {
			routeArr = await RouteModel.getByUserID(uid);
		} catch(err){
			res.send({'actionSuccess': false, 'error': 'Database error: ' + err});
		}

		if(routeArr){
			res.send({'actionSuccess': true, 'routeArr': routeArr});
		}
		else{
			res.send({'actionSuccess': false, 'error': 'You have no saved iteneraries'});
		}
	}
});


router.post('/api/updateRoute', async (req, res) => {

});


router.get('/api/deleteRoute', async (req, res) => {

});


module.exports = router;