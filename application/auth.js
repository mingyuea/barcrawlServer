const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const cEnc = require('./cookieEncrypt.js');

const mongoose = require('mongoose');
const User = require('../models/User.js');
const UserModel = mongoose.model('UserModel');
const Route = require('../models/Route.js');
const RouteModel = mongoose.model('RouteModel');

const saltRounds = 15;


router.post('/auth/signup', async (req, res) => {
	let { username, password } = req.body;
	let existBool = await UserModel.checkExist(username);

	if(existBool){   //checks if username already exists
		res.send({'actionSuccess': false, 'error': 'Username already exists'});
	}
	else{
		let uID = new mongoose.Types.ObjectId();
		let idString = String(uID);
		bcrypt.genSalt(saltRounds, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				var newUser = new UserModel({
					_id: uID,
					username: username,
					pass: hash,
				});

				newUser.save((err, doc) =>{
					if(err){
						errMsg = "There was an error while creating the userModel: " + err;
						console.log(errMsg);
						res.send({'actionSuccess': false, 'error': errMsg});
					}
				});

				var newRoute = new RouteModel({
					userID: idString
				});

				newRoute.save((err) => {
					if(err){
						errMsg = "There was an error while creating the routeModel: " + err;
						console.log(errMsg);
						res.send({'actionSuccess': false, 'error': errMsg});
					}
				});
			});
		});

		let enc = cEnc.cookieEncrypt(idString, true);

		res.cookie('uid', enc, {maxAge:604800000});
		res.send({'actionSuccess': true, 'redir': '/static/home'});
	}
});


router.post('/auth/login', async (req, res) => {
	let { username, password } = req.body;
	let existBool = await UserModel.checkExist(username);

	if(existBool){
		let { pass } = await UserModel.getPassHash(username);
		let compBool;

		try {
			compBool = await bcrypt.compare(password, pass);
		} catch(err){
			console.log(err);
			res.send({'actionSuccess': false, 'error': 'Error while fetching password: ' + err});
		}

		if(compBool){
			let userObj = await UserModel.getUserID(username);
			let uid = String(userObj['_id']);
			let enc = cEnc.cookieEncrypt(uid, true);

			let redir = "/static/home"

			res.cookie('uid', enc, {maxAge:604800000});
			res.send({'actionSuccess': true, 'redir': redir});
		}
		else{
			res.send({'actionSuccess': false, 'error': 'Incorrect password'});
		}
	}
	else{
		res.send({'actionSuccess': false, 'error': 'Username does not exist'});
	}
});


router.get('/auth/tmp', (req, res) => {
	res.cookie("uid", "tmp", {maxAge:1800000});
	res.send({'actionSuccess': true, 'redir': '/static/tmp'});
})


router.get('/auth/logout', (req, res) => {
	res.clearCookie('uid');
	res.redirect('/static/auth');
});


module.exports = router;