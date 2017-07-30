var winston = require('winston'),
    es = require('./esclient'),
    request = require('request-promise-native'),
    http = require('http'),
    httpAgent = new http.Agent();

httpAgent.maxSockets = 15;

function getWikiHtml(subject) {
    var urlparse = require('url'),
        params = {
                action: "parse", 
                page: subject,
                prop:  "text|links",
                format: 'json',
                redirects: true,
                noimages: true,
                disabletoc: true,
                disableeditsection: true,
                disablelimitreport: true
        },
        url = "http://en.wikipedia.org/w/api.php" + urlparse.format({ query: params });
        winston.info(url);
    return request({
            uri: url,
            json: true,
            pool: httpAgent
        })
        .catch(error => {
            winston.info(error);
            winston.error("Cannot retrieve html for " + subject);
        })
        .then( (response) => {
            if (!response) {
                response = {
                    parse: {
                        title: subject,
                        text: { "*":"" },
                        links: []
                    }
                }
            }
            response = response.parse;
            return {
                title: response.title,
                body: response.text['*'].toString(),
                links: response.links
                    .map( (e) => { return e['*']; })
                    .filter( (e) => {
                        return !/.*:.*/.test(e) &&
                               !/[0-9]+ \(number\)/.test(e);
                    })
            };
        })
        .catch(err => winston.error(err));
}

function getWikiText(page, onlySummary) {
    var urlparse = require('url'),
        params = {
            action: "query",
            titles: page,
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
            json: true,
            pool: httpAgent
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

function getWiki(subject, fields) {
    return es.getArticle(subject, fields)
        .then((article) => {
            if (typeof article === "string" ||
                article.hasOwnProperty("title")
            ) {
                return Promise.resolve(article);
            }
            else {
                return getWikiFromSource(subject)
                    .then((article) => {
                        return es.getArticle(article.title)
                            .then((response) => {
                                // Article exists but title is different than what we searched for
                                if (!response.hasOwnProperty('title')) {
                                    console.log("PUTTING: " + article.title)
                                    return es.putArticle(article);
                                }
                                else if (response.title != subject.toLowerCase() && !response.akas.includes(subject)) {
                                    console.log("UPDATING: " + article.title);
                                    return es.updateArticleAlias(article.title, subject);
                                }
                            })
                            .then(() => { return Promise.resolve(article); });
                    });
            }
        });
}

exports = module.exports = { getWiki, getWikiHtml, getWikiText, getWikiFromSource };