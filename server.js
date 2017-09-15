// ---------- Dependencies ---------- //
var express = require("express");

var logger = require("morgan");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var exphbs = require("express-handlebars"); 
var methodOverride = require("method-override");

var Article = require("./models/article.js");
var Comment = require("./models/comment.js");


// ----- express ----- //
var app = express();

// ----- morgan and body parser ----- //
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));


// ----- Set public directory as static ----- //
app.use(express.static("public"));

// ----- mongoose setup ----- //
mongoose.promise = Promise;



// ---------- HEROKU DB CONNECTION ----------- //
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI);
else mongoose.connect("mongodb://localhost/NewsDB");

var db = mongoose.connection;

// ----- Show any mongoose errors ----- //
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// ----- Once logged in to the db through mongoose, log a success message ----- //
db.once("open", function() {
	console.log("Mongoose connection successful.");
});


// ---------- Handlebars ---------- //
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//----- methodOverride setup ----- //
app.use(methodOverride("_method"));


//---------- ROUTES ---------- //
var router = require("./controllers/routes.js");
app.use(router);



// ---------- SERVER ---------- //
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
	console.log("listening on port: " + PORT);
});