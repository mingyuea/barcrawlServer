const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
	userID: String,
	routeArr: {type: [Schema.Types.Mixed], default: []},
	currentInd: {type: Number, default: 0},
	routeArchive: {type: [[Schema.Types.Mixed]], default: []}
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

routeSchema.statics.updateRoute = async function(userID, routeArr){
	try {
		await this.findOneAndUpdate({userID: userID,}, {$set: {routeArr: routeArr}})
	} catch (err) {
		let errMsg = "There was a database error while updating route: " + err;
		console.log(errMsg);
		return err;
	}
}

module.exports = mongoose.model('RouteModel', routeSchema);