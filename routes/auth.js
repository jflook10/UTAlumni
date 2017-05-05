var passport = require('passport');
var db = require('../models');
var path = require("path");
module.exports = function(app) {

	app.get('/signup', function(req, res) {
		res.sendFile(path.join(__dirname, "../public/html/sign-up.html"));
	});
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, "../public/html/index.html"))
	});
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/signup'
	}));
	app.get('/dashboard', isLoggedIn, function(req, res) {
		res.sendFile(path.join(__dirname, "../public/html/dashboard.html"));
	});

	app.get('/logout', function(req, res) {
		req.session.destroy(function(err) {
			res.redirect('/');
		});
	});

	// once user is logged in, send to dashboard page
	app.post('/', passport.authenticate('local-signin', {
		successRedirect: '/dashboard',
		failureRedirect: '/'
	}));
	
	// from index.html, send user from initial signup form to the sign-up.html
	app.post('/index', function(req, res){
		res.redirect('/signup')
	});

	app.get("/api/users", isLoggedIn, function(req, res) {
		var array = [];
		db.user.findOne({
			where: {
				id: req.user.id
			}
		}).then(function(dbUser) {
			array.push(dbUser);
			db.user.findAll({}).then(function(dbAll) {
				array.push(dbAll);
				res.json(array);
			})
		})
	});
	app.post("/myprofile", isLoggedIn, function(req, res) {
		db.user.update({
			email: req.body.email,
			employment: req.body.employment,
			location: req.body.location,
			linkedInURL: req.body.linkedInURL,
			profilePic: req.body.profilePic, 
			portfolioURL: req.body.portfolioURL,
			about: req.body.about,
			mentor: req.body.mentor,
			interview_time: req.body.interview_time,
			first_salary: req.body.first_salary,
			status: req.body.status
		},{
			where: req.user.id
		}).then(function(result){
			console.log(result);
		})
	})

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/signin');
	}
}