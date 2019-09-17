var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var seedDB = require("./seeds");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var methodOverride = require('method-override');
var flash = require("connect-flash");

var commentRoutes= require("./routes/comments"),
	campgroundRoutes= require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');
//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride('_method'));
app.use(flash());
app.use(require('express-session')({
	secret:"these are for us to name",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");

	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000, process.env.IP, function(){
	console.log("started");
});