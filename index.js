var wiki = require('./ks-wiki'),
    es = require('./esclient');

function getMostReleventWikiArticles(subject, articles) {
    return getWikiArticles(subject, articles)
        .then(() => {
            return es.getMoreLikeThis(subject, 5).then((relatedTitles) => {
                Object.keys(relatedTitles).forEach((relatedTitle) => {
                    getWikiArticles(relatedTitle, articles);
                })
            });
        })
}

function getWikiArticles(subject, articles, breadth, depth) {
    if (breadth == undefined) { breadth = 350; }
    if (depth == undefined) { depth = 1; }
    console.log(Array(depth).join("-") + "->" + subject);
    return wiki.getWiki(subject)
                .then( (subjectArticle) => {
                    if (subjectArticle) {
                        articles[subjectArticle.title] = subjectArticle;
                        var subjectLinks = subjectArticle.links;
                        if (!(depth > 0 && subjectLinks.length > 0)) {
                            return Promise.resolve(articles);
                        } else {
                            var links = [];
                            subjectLinks
                                .filter((e) => {
                                    return !articles.hasOwnProperty(e);
                                })
                                .slice(0, breadth)
                                .forEach((linkSubject) => {
                                    links.push(getWikiArticles(linkSubject, articles, breadth, depth-1));
                                });
                            return Promise.all(links).then(() => {
                                return Promise.resolve(articles);
                            });
                        }
                    }
                })
}

function populateArticles(title) {
    var articles = {};
    //return getWikiArticles(title, articles).then(() => { return Object.keys(articles); } );
    return getMostReleventWikiArticles(title, articles)
        .then(() => { return Object.keys(articles); } );
}

exports = module.exports = { populateArticles };


