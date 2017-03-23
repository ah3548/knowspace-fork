var wikipedia = require("node-wikipedia"),
    orm = require("./ks-orm");

var getText = function (response) {
    return response.text['*'].toString();
}

function getWiki(subject) {
    return new Promise(function(resolve, reject) {
        wikipedia.page.data(
            subject, 
            { content: true }, 
            resolve
        );
    })
    .then(
        function(resolve, reject) {
           return getText(resolve);
        }
    ).catch(error => { throw new Error("Subject Does Not Exist"); });
}

function setWiki(subject, content) {
    return orm.createWikiEntry(
        {
            subject:subject, 
            content:content
        }
    ).then(
        function(wiki) {
            return wiki.content;
        }
    );
}

function getStoredWiki(subject) {
    return orm.getWikiEntry(subject);
}

function notAvailabeGetFromWeb(error) {
    console.log(error);
    return getWiki(error.subject).then(
        function(content) {
            console.log("Inserting wikipedia entry into database");
            return setWiki(error.subject, content);
        }
    );
}

function getContent(content) {
    console.log("Returning content")
    return content;
}


function getWikiEntry(subject) {
    return getStoredWiki(subject)
        .catch(notAvailabeGetFromWeb)
        .then(getContent)
        .catch(error => { return error.message });
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