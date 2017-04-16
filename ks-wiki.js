var wikipedia = require("node-wikipedia"),
    orm = require("./ks-orm"),
    winston = require('winston'),
    es = require('./esclient');

function getWikiHtml(subject) {
    return new Promise(function(resolve, reject) {
        wikipedia.page.data(
            subject,
            {content: true},
            resolve
        );
    })
    .catch(error => { throw new Error("Subject Does Not Exist"); })
    .then( (response, reject) => {
        return {
            title: response.title,
            body: response.text['*'].toString(),
            links: response.links
                .map( (e) => { return e['*']; })
                .filter( (e) => { return !e.includes("Template:"); })
        };
    });
}

function getWikiText(page, onlySummary) {
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

function getWiki(subject) {
    return es.getArticle(subject)
        .then ((response) => {
            return response;
        })
        .catch(() => {
            var wikiPromises = [
                getWikiHtml(subject),
                getWikiText(subject)
            ];
            return Promise.all(wikiPromises).then((subjectResponse) => {
                var article = {
                    title: subjectResponse[0].title,
                    html: subjectResponse[0].body,
                    links: subjectResponse[0].links,
                    text: subjectResponse[1]
                };
                return es.putArticle(article).then(() => {
                    return article;
                });
            });
        });
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


//getWiki('Linear Algebra').then(response => console.log(response) );
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