const express = require('express');
const router = express.Router();
const https = require('https');

const apiKey = "bGrMQxZPk3x6BKe-p9rljIC29lESM1hkSEkuc8gsW7iaeD2nLxbLRlYzc1-CDCGJ-ZJDGpzr-klFDXYpH_itOsJQYWoPE5wwqtdAzEZ1itZxs3ia2zL6MdnJQPN4W3Yx";

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
});

module.exports = router;