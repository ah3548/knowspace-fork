var expect = require("chai").expect;
var wiki = require("../ks-wiki");

describe("index", function() {
    describe("getWikiText", function() {
        it("Linear_Algebra", function() {
            return wiki.getWikiText('Linear_Algebra', false)
                .then((result) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
    describe("getWikiHtml", function() {
        it("Linear_Algebra", function() {
            return wiki.getWikiHtml('Linear_Algebra', false)
                    .then((result) => {
                    console.log(result);
            })
            .catch((err) => {
                console.log(err);
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

    describe.only("getWiki", function() {
        it("Coordinate system", function() {
            return wiki.getWiki('Coordinate system', false)
                .then((result) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });


    describe("getWiki", function() {
        it("Linear Algebra and Links", function() {
            this.timeout(60000);
            var articles = [];
            return wiki.getWiki('Linear Algebra')
                .then((result) => {
                    articles.push(result);
                    var links = [];
                    result.links.splice(0,50).forEach((link) => {
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