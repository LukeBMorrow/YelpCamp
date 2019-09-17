var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/campgrounds", {campgrounds: campgrounds});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author ={id: req.user._id, username:req.user.username};
	Campground.create(
		{
			name:name,
			image:image,
			price:price,
			description:description,
			author:author
		},function(err, campground){
			if(err){
				console.log(err);
			}else{
				req.flash("success", "Comment posted!");
				res.redirect("/campgrounds");
			}
	});
	
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//shows more info about one campground
router.get("/:id",function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	});
});
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect(req.params.id);
		}
	});
});

router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");

		}else{
			req.flash("success", "Comment deleted!");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;