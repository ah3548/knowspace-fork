var express = require('express');
var wiki = require('./ks-wiki');
var orm = require('./ks-orm');
var app = express();


//var Faker = require('faker');
//var randomName = Faker.Name.findName(); // Rowan Nikolaus containing many properties


var subject = "Linear_algebra";

app.use(express.static('.'));


function getWikiFromDB(subject) {
    return orm.getWikiEntry(subject).then(
        function(content) {
            return content;
        }
    ).catch(
        function(error) {
            console.log("Wikipedia Entry not found, fetching now..");
            return getWiki(subject).then(
                function(content) {
                    return content;
                }
            );
        }
    );
}

function getWiki(subject) {
    return wiki.getWikiEntry(subject).then(
        function(content) {
            return orm.createWikiEntry( 
            {subject:subject, content:content});
        }
    );
}


app.get('/wiki', function (req, res) {
    getWikiFromDB(subject).then(
        function(content) {
            res.send(content);
        }
    );
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
