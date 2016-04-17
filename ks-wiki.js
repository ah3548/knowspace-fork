var wikipedia = require("node-wikipedia");


var getText = function (response) {
    return response.text['*'];
}

var getWikiPage = function (callback) {
    wikipedia.page.data(
        "Linear_algebra", 
        { content: true }, 
        function(response) {
            callback(getText(response))
        }
    );
}

exports = module.exports = getWikiPage;



/*
wikipedia.revisions.all("Miles_Davis", { comment: true }, function(response) {
	// info on each revision made to Miles Davis' page
});

wikipedia.categories.tree(
	"Philadelphia_Phillies",
	function(tree) {
		//nested data on the category page for all Phillies players
	}
);*/