// ---------- Click function ---------- //

$(document).ready(function() {

	// let user know scrape is completed
	$("#get-articles").on("click", function(){
		alert("Scrape Completed. Please REFRESH the page!!!!");
	});

	// toggle display of the create a comment div for specific article
	$(".article").on("click", ".make-comment", function() {
		event.preventDefault();
		$(this).parent().parent().find(".create-comment-container").toggleClass("display-none");
	});

	//toggle diplay of commment divs for specific article
	$(".article").on("click", ".view-comment", function() {
		event.preventDefault();
		$(this).parent().parent().find(".comments-container").toggleClass("display-none");
	});

	//Delete selected comment
	$(".delete-comment").on("click", function(event) {
		event.preventDefault();
		var commentId = $(this).parent().attr("data-id");

		//Make post request to delete comment from database
		$.ajax({
			url: "/api/delete/comment/" + commentId + "?_method=DELETE",
			method: "POST",
			data: {id: commentId}
		}).done(function(response) {
			if (response.success) {
				console.log("comment deleted");
				window.location = "/";
			}
		});
	});
});
