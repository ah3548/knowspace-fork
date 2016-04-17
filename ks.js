var express = require('express');
var wiki = require('./ks-wiki');
var app = express();

//var Faker = require('faker');
//var randomName = Faker.Name.findName(); // Rowan Nikolaus containing many properties
    console.log(wiki);

app.use(express.static('.'));

app.get('/wiki', function (req, res) {
    wiki(function(response) {
        res.send(response);
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

