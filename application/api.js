const express = require('express');
const router = express.Router();
//const cookieParser = require('cookie-parser');
const cEnc = require('./cookieEncrypt.js');
const mongoose = require('mongoose');
const Route = require('../models/Route.js');
const RouteModel = mongoose.model('RouteModel');

const apiKey = "bGrMQxZPk3x6BKe-p9rljIC29lESM1hkSEkuc8gsW7iaeD2nLxbLRlYzc1-CDCGJ-ZJDGpzr-klFDXYpH_itOsJQYWoPE5wwqtdAzEZ1itZxs3ia2zL6MdnJQPN4W3Yx";
//this should be in server.js, before anything else. if cookie is empty, redirect to login


/*router.post('/api/init', async (req, res) => {
	let uid = res.locals.uid;
	let routeObj;

	try{
		routeObj = await RouteModel.getByUserID(uid);
	} catch(err){
		let errMsg = "There was an error getting the route for this user: " + errMsg
		console.log(errMsg);
		res.send({"actionSuccess": false, "error": errMsg});
	}

	res.send({"actionSuccess": true, "routeObj": routeObj})
});


router.post('/api/search', async (req, res) => {
	//console.log("hit")
	let { startAdd, endAdd, limitNum } = req.body;
	let queryString = "https://api.yelp.com/v3/businesses/search?term=bar&sort_by=distance&location=\"" + startAdd + "\"";
	let yelpRes;

	if(limitNum){
		queryString = queryString + "&limit=" + limitNum;
	} else {
		queryString = queryString + "&limit=10";
	}
	let options = {
		headers: {"Authorization": "Bearer "+apiKey}
	}

	https.get(queryString, options, (resp) => {
		let data = "";

		resp.on('data', (chunk) => {
		    data += chunk;
		});

		resp.on('end', () => {
			let uid = req.cookies.uid;
			data = JSON.parse(data);

			if(data.error){
				let errMsg = "There was an error accessing the Yelp API: " + data.error.description
				console.log(errMsg);
				res.send({"actionSuccess": false, "error": data.error.description});
			}
			else{
				res.send({"actionSuccess": true, "locations":data.businesses});	
			}
		});
	})
	.on("error", (err) => {
		console.log("There was an error accessing the Yelp API: " + err.description);
		res.send({"actionSuccess": false, "error": err.description});
	});
})*/



router.post('/api/saveRoute', async (req, res) => {
	let uid = res.locals.uid;
	//let myRoute = ['a','b','c'];
	let { routeArr }= req.body;


	/*if(uid != "tmp"){
		var newRoute = new RouteModel({
			userID: uid,
			routeArr: routeArr
		});

		newRoute.save((err, doc) => {
			if(err){
				console.log('Database error in saving: '+ err);
			}
		});
		res.send({'actionSuccess': true, 'saved': true});
	}
	res.send({'test':true});*/
});


router.get('/api/deleteRoute', async (req, res) => {
	let uid = res.locals.uid;


})


router.get('/api/getRoute', async (req, res) => {
	let uid = res.locals.uid;
	//console.log('the userid is' + uid);
	if(uid == "tmp"){
		res.send({'actionSuccess': false, 'error': 'You are using a temporary account, your route info was not saved'});
	}
	else{
		let routeObj;
		try {
			routeObj = await RouteModel.getByUserID(uid);
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