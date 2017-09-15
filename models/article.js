// ---------- Dependencies ---------- //
var mongoose = require("mongoose");

// ----- Create Schema class ----- //
var Schema = mongoose.Schema;

//----- Define Article Schema ----- //
var ArticleSchema = new Schema({
	title: {
		type: String,
		trim: true,
		unique: true,
		required: "Article title is required"
	},
	link: {
		type: String,
		trim: true,
		required: "Link is required"
	},
	summary: {
		type: String,
		trim: true,
		required: "Summary is required"

	},
	date: {
	    type: Date,
	    trim: true,
	    required: "Date is required"		
	},
	image: {
		type: String,
		required: "Image is required"
	},
	comments:[{
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

// ----- Save the Article model ----- //
var Article = mongoose.model("Article", ArticleSchema);

// ----- export the model ----- //
module.exports = Article;