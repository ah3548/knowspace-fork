var wiki = require('./ks-wiki');

function getWikiArticles(subject, articles, breadth, depth) {
    if (breadth == undefined) { breadth = 2; }
    if (depth == undefined) { depth = 1; }
    return wiki.getWiki(subject)
                .then( (subjectArticle) => {
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
                })
}



var title = "Linear Algebra";
var articles = {};
getWikiArticles(title, articles, 150, 2).then(() => {
    //console.log(response);
    for (var art in articles) {
        console.log(articles[art].title);
    }
});

