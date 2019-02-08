const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/init/home', (req, res) => {
	res.send({'location': 'the inital page where you start the routing'})
});

router.get('/init/route', (req, res) => {
	res.send({'location': 'displays the route after you selected/confirmed'});
});

module.exports = router;