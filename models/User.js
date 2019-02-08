const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	pass: {
		type: String,
		required: true
	},
	_userID: String
});

/*userSchema.statics.checkExist = async function(username){
	return await this.findOne({username: username}, function(err, res){
		if(err){
			return err;
		}
		if(res){
			return true;
		}
		else{
			return false;
		}
	})
}*/

userSchema.statics.checkExist = async function(username){
	let result;
	try{
		result = await this.findOne({username: username});
	} catch (err) {
		console.log(err);
		return err;
	}

	if(result){
		return true;
	}
	else{
		return false;
	}
}

userSchema.statics.getPassHash = async function(username){
	let pw;
	try{
		pw = await this.findOne({username: username}, 'pass')
	} catch (err){
		console.log(err);
		return err;
	}
	return pw;
}

userSchema.statics.getUserID = async function(username){
	return await this.findOne({username: username}, '_userID', function(err, res){
		if(err){
			return err;
		}
		return res;
	})
}

module.exports = mongoose.model('UserModel', userSchema);