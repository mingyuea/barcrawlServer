const express = require('express');
const router = express.Router();
const cEnc = require('./cookieEncrypt.js');
const mongoose = require('mongoose');
const Route = require('../models/Route.js');
const RouteModel = mongoose.model('RouteModel');


router.use((req,res, next) =>{
	if(res.locals.uid && res.locals.uid != "tmp"){
		next();
	}
	else{
		res.redirect('403', '/static/auth')
	}
})


router.get('/api/init', async (req, res) => {
	let uid = res.locals.uid;
	let routeRes, savedRoute;

	try{
		routeRes = await RouteModel.getCurrRoute(uid);
		savedRoutes = await RouteModel.getSavedNames(uid);
	} catch(err){
		let errMsg = "there was an error initializing API: " + err
		console.log(errMsg);
		res.send({"actionSuccess": false, "error": errMsg});
	}
	console.log(routeRes)
	if(routeRes.routeArr.length > 0){
		let { routeArr, currentInd } = routeRes;
		res.send({"actionSuccess": true, "routeArr": routeArr, "currentInd": currentInd, "savedRoute": savedRoutes});
	}
	else{
		res.send({"actionSuccess": false, "error": "No current route", "savedRoutes": savedRoutes});
	}
});


router.post('/api/update/route', async (req, res) => {
	let uid = res.locals.uid;
	let { routeArr, routeInd }= req.body;

	try{
		await RouteModel.updateRoute(uid, routeArr);
	} catch(err){
		let errMsg = "there was an error updating the user's route: " + err
		console.log(errMsg);
		res.send({"actionSuccess": false, "error": errMsg});
	}

	if(routeInd){
		await RouteModel.updateCurrInd(uid, routeInd);
	}

	res.send({"actionSuccess": true});
});


router.post('/api/update/ind', async (req, res) => {
	let uid = res.locals.uid;
	let { currInd } = req.body;

	try{
		await RouteModel.updateCurrInd(uid, currInd);
	} catch(err){
		let errMsg = "there was an error updating the user's current index: " + err
		console.log(errMsg);
		res.send({"actionSuccess": false, "error": errMsg});
	}

	res.send({"actionSuccess": true});
});


router.post('/api/routes/:newAction', async (req, res) =>{

	let newAction = req.params.newAction;
	let uid = res.locals.uid;


	if(newAction == "save"){
		let { routeArr, routeName } = req.body;
		let routeObj = {
			"routeArr": routeArr,
			"routeName": routeName
		}

		try{
			await RouteModel.saveRoute(uid, routeObj)
		} catch(err) {
			let errMsg = "There was a database error while saving the route: " + err;
			console.log(errMsg);
			res.send({"actionSuccess": false, "error": errMsg});
		}
		res.send({"actionSuccess": true});
	}
	else if(newAction == "get"){
		let { routeInd } = req.body;
		let routeArr;

		try{
			routeArr = await RouteModel.getRoute(uid, routeInd);
		} catch (err){
			let errMsg = 'Database lookup error while getting route array: '+ err;
			console.log(errMsg);
			res.send({"actionSuccess": false, "error": errMsg});
		}
		console.log(routeArr, "is routeArr")
		if(routeArr){
			res.send({"actionSuccess": true, "routeArr": routeArr});
		}
		else{
			res.send({"actionSuccess": false, "error": "Route doesn't seem to exist"});
		}
	}
	else if(newAction == "delete"){
		let { routeName } = req.body;

		try{
			await RouteModel.delSavedRoute(uid, routeName);
		} catch(err){
			let errMsg = "There was a database error while deleting the route: " + err;
			console.log(errMsg);
			res.send({"actionSuccess": false, "error": errMsg});
		}

		res.send({"actionSuccess": true});
	}
	else{
		res.send({'actionSuccess': false, "error": "path not found"});
	}
})


module.exports = router;