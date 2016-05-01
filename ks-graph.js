var cheerio = require('cheerio'),
    orm = require('./ks-orm');

orm.getWikiEntry('Linear_algebra').then(
    function(body) {
        $ = cheerio.load(body);
        links = $('a'); //jquery get all hyperlinks
        $(links).each(function(i, link){
            console.log($(link).text() + ':\n  ' +    $(link).attr('href'));
      });
    }
);