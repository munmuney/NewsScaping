// ---------- Dependencies ----------//
var express = require("express");
var bodyParser = require("body-parser");

var cheerio = require("cheerio");
var request = require("request");


//----- Router ----- //
var router = express.Router();

// ----- Body parser ----- //
router.use(bodyParser.urlencoded({
  extended: false
}));

// ----- Models ----- //
var Article = require("../models/article.js");
var Comment = require("../models/comment.js");



// ---------- ROUTES ---------- //

// ----- Homepage ----- //
router.get("/", function(req, res) {
	
	// read all articles from db, populates page
	Article.find({}).populate("comments").exec(function(error, docs) {
		if (error) console.log(error);
		else res.render("index", {article: docs});
	});
});


// ----- Scraping ----- //
router.get("/api/scrape", function(req, res) {
	request("https://www.wsj.com/news/life-arts/food-cooking-drink", function(error, response, html) {
	    // load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(html);

		// iterate through selected element type for desired data
    	$("article.WSJTheme__story_2i1tTaI4lQjo5n3SyWVF4d").each(function(index, element) {
		
      		// Save an empty result object
			var result = {};

			//fill fields required by article schema
			result.title = $(this).find("a").text();
			result.link = $(this).find("a").attr("href");
			result.date = $(this).find("p.style__timestamp_2O9WPLuNWqEjxSMJEZEYBW").text();
			result.summary = $(this).find("p.WSJTheme__summary_3Y82JxyZbAulQg5bJtXXay").text();
			result.image = $(this).find("div.WSJTheme__image_1Ezq26dHjZHFlWw-uUEy7x").find("a").find("img").attr("src");

			// Using our Article model, create a new entry
      		var articleEntry = new Article(result);

			//save article into database
			articleEntry.save({}, function(error, doc) {
				if (error) console.log(error);
				else console.log("Unique article saved.");
			});
		}); 
	});
	res.redirect("/");
});

// ----- Comment POST ----- //
router.post("/api/new/comment/:id", function(req, res) {

	// Using our Comment model, create a new entry
	var comment = new Comment(req.body);

	// save the comment 
	comment.save(function(error, doc) {
		if (error) console.log(error);
		else {

			//push the comment into the comments array of relevant Article
			Article.findOneAndUpdate({"_id": req.params.id}, {$push: {"comments": doc._id}})
			.exec(function(error, newdoc) {
				if (error) console.log(error.message);
				else res.redirect("/");
			});
		}
	});
});

//delete a comment from any article
router.delete("/api/delete/comment/:id", function(req, res)
{
	Comment.remove({"_id": req.params.id}, function(error, doc)
	{
		if (error)
			console.log(error);
		else
		{
			console.log("redirecting via front end function");
			res.json({success: true});
		}
	});
});

module.exports = router;









