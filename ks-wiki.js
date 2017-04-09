var wikipedia = require("node-wikipedia"),
    orm = require("./ks-orm"),
    winston = require('winston');

var getText = function (response) {
    return response.text['*'].toString();
}

function getWiki(page, onlySummary) {
    var request = require('request-promise-native'),
        urlparse = require('url'),
        params = {
            action: "query",
            titles: page.replace(/[-]/g, '_'),
            format: 'json',
            prop: 'extracts',
            explaintext: '',
            indexpageids: '',
            redirects: ''

        };
    if (onlySummary) {
        params.exintro ='';
    }
    var url = "http://en.wikipedia.org/w/api.php" + urlparse.format({ query: params });
    winston.info(url);
    return request({
            uri: url,
            json: true
        }).then( (body) => {
            var article = body.query.pages[body.query.pageids[0]].extract;
            return article;
        });
};


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

exports = module.exports = { getWiki, getWikiEntry };


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