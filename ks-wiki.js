var wikipedia = require("node-wikipedia"),
    orm = require("./ks-orm"),
    winston = require('winston'),
    es = require('./esclient');

function getWikiHtml(subject) {
    var request = require('request-promise-native'),
        urlparse = require('url'),
        params = {
                action: "parse", 
                page: subject.replace(/[-]/g, '_'),
                prop:  "text|links",
                format: 'json',
                redirects: true,
                noimages: true,
                disabletoc: true,
                disableeditsection: true,
                disablelimitreport: true
        },
        url = "http://en.wikipedia.org/w/api.php" + urlparse.format({ query: params });
        winston.log(url);
    return request({
            uri: url,
            json: true
        })
        .catch(error => { throw new Error("Subject Does Not Exist"); })
        .then( (response) => {
            response = response.parse;
            return {
                title: response.title,
                body: response.text['*'].toString(),
                links: response.links
                    .map( (e) => { return e['*']; })
                    .filter( (e) => { return !/.*:.*/.test(e); })
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
    return request({
            uri: url,
            json: true
        }).then( (body) => {
            var article = body.query.pages[body.query.pageids[0]].extract;
            return article;
        }).catch( (error) => {
            winston.log(error);
            throw error;
        });
};

function getWikiFromSource(subject) {
    var wikiPromises = [
        getWikiHtml(subject),
        getWikiText(subject)
    ];
    return Promise.all(wikiPromises).then((subjectResponse) => {
        var article = {
            title: subjectResponse[0].title,
            html: subjectResponse[0].body,
            links: subjectResponse[0].links,
            text: subjectResponse[1],
            akas: []
        };
        if (article.title.toLowerCase() !== subject.toLowerCase()) {
            article.akas.push(subject);
        }
        return article;
    }).catch( (error) => {
        winston.log(error);
        throw error;
    });
}

function getWiki(subject) {
    return es.getArticle(subject)
        .catch(() => {
            return getWikiFromSource(subject)
                .then((article) => {
                    return es.getArticle(article.title)
                        .then((response) => {
                            // Article exists but title is different than what we searched for
                            if (response.title != subject.toLowerCase() && !response.akas.includes(subject)) {
                                console.log("UPDATING: " + article.title);
                                return es.updateArticleAlias(article.title, subject);
                            }
                        })
                        .catch(() => {
                            console.log("PUTTING: " + article.title)
                            return es.putArticle(article);
                        })
                        .then(() => { return Promise.resolve(article); });
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

//getWiki("Cauchy–Schwarz inequality").then((response)=> console.log(response));
//getWiki('Abelian group').then(response => console.log(response) );
//getWiki("Characteristic value").then((response)=> console.log(response));

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