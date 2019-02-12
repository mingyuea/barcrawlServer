const Cryptr = require('cryptr');
const cryptr = new Cryptr('dev');

/*
This module encrypts and decrypts strings from the cookie. When encBool is true, it encrypt,
and decrypts when it is false.
*/

module.exports.cookieEncrypt = (cookieString, encBool) => {
	if(encBool){
		return cryptr.encrypt(cookieString);
	}
	else{
		return cryptr.decrypt(cookieString);
	}
}