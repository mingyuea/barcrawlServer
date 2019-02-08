const Cryptr = require('cryptr');
const cryptr = new Cryptr('dev');

module.exports.cookieEncrypt = (cookieString, encBool) => {
	if(encBool){
		return cryptr.encrypt(cookieString);
	}
	else{
		return cryptr.decrypt(cookieString);
	}
}