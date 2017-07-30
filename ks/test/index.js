var expect = require("chai").expect;
var index = require("../ks/index");

describe("index", function() {
    describe("populateArticles", () => {
        var title = "linear algebra";
        it(title, () => {
            this.timeout(60000);
            return index.populateArticles(title)
                .then( (result) => console.log(result) )
                .catch( (err) => console.log(err) );
        });
    });
});
