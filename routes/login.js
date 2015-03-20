var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
	res.render('login', { title: 'Cracker Jack' });
});

/* POST login form. */
router.post('/', function(req, res, next) {
	req.session.isAuthorized = false;
	if(database.users[req.username].password === req.password) {
		req.session.isAuthorized = true;
		res.send("Authentication successful.");
	} else {
		req.session.isAuthorized = false;
		res.send("Login failed.");
	}
});

module.exports = router;
