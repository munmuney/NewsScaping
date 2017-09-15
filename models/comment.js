// ---------- Dependencies ---------- //
var mongoose = require("mongoose");
var moment = require("moment");

// ----- Create Schema class ----- //
var Schema = mongoose.Schema;


//----- Define Comment Schema ----- //
var CommentSchema = new Schema({
	commentator: {
		type: String,
		trim: true,
		required: "Must put an author name",
		validate: [
			function(authorName)
			{
				return (authorName.length > 0);
			},
			"Author name must contain more than 0 characters"
		]
	},
	body:
	{
		type: String,
		trim: true,
		required: "Comment body cannot be blank",
		validate: [
			function(input)
			{
				//ensure comment body is greater than 0 and less than 301
				return (input.length > 0);
			},
			"Comment must contain more than 0 characters." 
		]
	},
	postedAt:
	{
		type: String,
		default: moment().format("MMMM Do YYYY, h:mm a")
	}
});

// ----- Save the Comment model ----- //
var Comment = mongoose.model("Comment", CommentSchema);

// ----- export the model ----- //
module.exports = Comment;






