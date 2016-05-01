var cheerio = require('cheerio'),
    orm = require('./ks-orm'),
    htt = require('html-to-text');
    //natural = require('natural');


function removeComments(body) {
    var $ = cheerio.load(body);

    $.root()
        .contents()
        .filter(function() {
            return this.type === 'comment'; 
        })
        .remove();

    return $.root().html();
}

function removeMetaData(body) {
    var $ = cheerio.load(body);

    $.root()
        .contents()
        .filter(function() {
            var c = $(this).attr('class');
            if (c != undefined) {
                return isMetaDataClass(c);
            }
            else {
                return false;
            }
        })
        .remove();

    return $.root().html();
}

function isMetaDataClass(c) {
    var metaData = false;
    var metaClasses = [
        'infobox',
        'toc',
        'navbox',
        'reflist',
        'hatnote',
        'thumb',
        'm-box',
        'metadata'
    ];
    metaClasses.forEach(
        function(entry) {
            if (c.indexOf(entry) != -1) {
                metaData = true;
            }
        }
        
    );
       
    return metaData;
}

function getAllLinks(body) {
    $ = cheerio.load(body);
    links = $('a'); //jquery get all hyperlinks
    var result = [];
    $(links).each(function(i, link){
        var t = $(link).text(),
            l = $(link).attr('href');
        if (l.indexOf('/wiki/') != -1 &&
            t !== 'ISBN') { 
            result.push(
                {title:t, link:l}
            );
        }
    });
    return result;
}

function extractText(body) {
    var text = htt.fromString(body, {
        wordwrap: 130,
        ignoreHref: true,
        ignoreImage: true,
        preserveNewlines: true
    });
    return text;
}


/* Come back to at later point, not relevant right now */
/*
function getImportance(body, word) {
    var TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

tfidf.addDocument(body);
tfidf.tfidfs('Bhubaneswar, India', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
tfidf.listTerms(0).forEach(function(item) {
    console.log(item.term + ': ' + item.tfidf);
});
}*/

/*orm.getWikiEntry('Bud_Mishra')
    .then(removeComments)
    .then(removeMetaData)
    .then(extractText)
    .then(content => console.log(content));*/


module.exports = {
    extractText,
    removeMetaData,
    getAllLinks
}
