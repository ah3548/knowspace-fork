var wikipedia = require("node-wikipedia");

var getText = function (response) {
    return response.text['*'].toString();
}

function getWikiEntry(subject) {  
    return new Promise(function(resolve, reject) {
        wikipedia.page.data(
            subject, 
            { content: true }, 
            resolve
        );
    }).then(
        function(resolve, reject) {
           return getText(resolve);
        }
    );
}

exports = module.exports = { getWikiEntry };


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