const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
	userID: String,
	routeArr: {type: [Schema.Types.Mixed], default: []},
	currentInd: {type: Number, default: 0},
	routeArchive: {type: [Schema.Types.Mixed], default: []}
});


routeSchema.statics.getByUserID = async function(userID){
	let res;
	try {
		res = await this.findOne({userID: userID})
	} catch(err){
		console.log('Database lookup error: '+ err);
		return err;
	}

	if(res){
		return res;
	}
	else{
		return false;
	}
	
}


routeSchema.statics.checkRouteExist = async function(userID){
	let res;
	try {
		res = await this.findOne({userID: userID}, 'routeArr')
	} catch(err){
		console.log('Database lookup error: '+ err);
		return err;
	}

	if(res.routeArr.length > 0){
		return true;
	}
	else{
		return false;
	}
}


routeSchema.statics.getCurrRoute = async function(userID){
	let res;
	try {
		res = await this.findOne({userID: userID}, 'routeArr currentInd')
	} catch(err){
		console.log('Database lookup error while finding current route: '+ err);
		return err;
	}

	if(res){
		return res;
	}
	else{
		return false;
	}
}


routeSchema.statics.updateRoute = async function(userID, routeArr){
	try {
		await this.findOneAndUpdate({userID: userID,}, {$set: {routeArr: routeArr}})
	} catch (err) {
		let errMsg = "There was a database error while updating route: " + err;
		console.log(errMsg);
		return err;
	}
}


routeSchema.statics.updateCurrInd = async function(userID, ind){
	try {
		await this.findOneAndUpdate({userID: userID,}, {$set: {currentInd: ind}})
	} catch (err) {
		let errMsg = "There was a database error while updating route index: " + err;
		console.log(errMsg);
		return err;
	}
}

routeSchema.statics.getSavedNames = async function(userID){
	let res;
	try {
		res = await this.findOne({userID: userID}, 'routeArchive')
	} catch(err){
		console.log('Database lookup error while getting route archive: '+ err);
		return err;
	}

	if(res){
		let nameArr = [];
		let resArr = res.routeArchive
		let resLen = resArr.length;
		for(let i = 0; i < resLen; i++){
			nameArr.push(resArr[i].routeName);
		}

		return nameArr;
	}
	else{
		return false;
	}
}

routeSchema.statics.saveRoute = async function(userID, routeObj){
	try {
		await this.findOneAndUpdate({userID: userID}, {$addToSet: {routeArchive: routeObj}})
	} catch (err) {
		let errMsg = "There was a database error while saving the route: " + err;
		console.log(errMsg);
		return err;
	}
	return;
}

routeSchema.statics.getRoute = async function(userID, routeInd){
	let res;
	try {
		res = await this.findOne({userID: userID}, 'routeArchive')
	} catch(err){
		console.log('Database lookup error while getting route archive: '+ err);
		return err;
	}
	
	if(res){
		let routeObj = res.routeArchive[routeInd].routeArr;
		return routeObj;
	}
	else{
		return false;
	}
}

routeSchema.statics.delSavedRoute = async function(userID, routeName){
	try {
		await this.findOneAndUpdate({userID: userID,}, {$pull: {routeArchive: {routeName: routeName}}})
	} catch (err) {
		let errMsg = "There was a database error while deleting the route: " + err;
		console.log(errMsg);
		return err;
	}
	return;
}

module.exports = mongoose.model('RouteModel', routeSchema);