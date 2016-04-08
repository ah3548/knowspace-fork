var express = require('express');
var app = express();

//var Faker = require('faker');
//var randomName = Faker.Name.findName(); // Rowan Nikolaus containing many properties

app.use(express.static('.'));

/*app.get('/', function (req, res) {
  res.send('Hello ' + randomName + '!');
});*/

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

