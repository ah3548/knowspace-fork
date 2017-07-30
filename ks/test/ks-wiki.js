var expect = require("chai").expect;
var wiki = require("../ks/ks-wiki");

describe("index", function() {
    describe("getWikiText", function() {
        it("Linear Algebra", function() {
            return wiki.getWikiText('Linear Algebra', false)
                .then((result) => {
                    //console.log(result);
                    return result;
                })
                .catch((err) => {
                    console.log(err);
                    return err;
                });
        });
    });
    describe("getWikiHtml", function() {
        it("Linear Algebra", function() {
            this.timeout(60000);
            return wiki.getWikiHtml('Linear Algebra', false)
                    .then((result) => {
                        console.log(result);
                        return result;
                    })
                    .catch((err) => {
                        console.log(err);
                        return err;
                    });
        });
    });

    describe("getWiki", function() {
        it("Linear Algebra", function() {
            return wiki.getWiki('Linear Algebra', false)
                .then((result) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });

    describe("getWiki", function() {
        it("N-dimensional space", function() {
            return wiki.getWiki('N-dimensional space')
                .then((result) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });


    describe.only("getWiki", function() {
        it("Linear Algebra and Links", function() {
            this.timeout(60000);
            var articles = [];
            return wiki.getWiki('Linear Algebra')
                .then((result) => {
                    articles.push(result);
                    var links = [];
                    result.links.splice(0,350).forEach((link) => {
                        links.push(wiki.getWiki(link));
                    })
                    return Promise.all(links);
                })
                .then((linksResult) => {
                    linksResult.forEach((e) => {
                        articles.push(e);
                    });
                    console.log(articles.length);
                    return articles;
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
});