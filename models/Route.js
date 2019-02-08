const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
	userID: String,
	routeArr: [Schema.Types.Mixed]
});


routeSchema.statics.getByUserID = async function(userID){
	let res;
	try {
		res = await this.findOne({userID: userID}, 'routeArr')
	} catch(err){
		console.log('Database lookup error: '+ err);
		return err;
	}

	if(res){
		return res.routeArr;
	}
	else{
		return false;
	}
	
}


routeSchema.statics.checkExist = async function(userID){
	let res;
	try {
		res = await this.findOne({userID: userID}, 'routeArr')
	} catch(err){
		console.log('Database lookup error: '+ err);
		return err;
	}

	if(res){
		return true;
	}
	else{
		return false;
	}
}

module.exports = mongoose.model('RouteModel', routeSchema);