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
    
    console.log($('a').attr('href'));
    $('a').attr('href',"#?subject=" + $('a').attr('href')+"&scrollTo=Guides");
    //$('a').attr("ng-click","appIntercept($event)");

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


function removeEditLinks(body) {
    $ = cheerio.load(body);    
    var level = $.root().contents();
    level.find('.mw-editsection').remove();
        
    var lastHeader = null;
    $.root().children().each(
        function(i, element) {
            if (element.name === 'h2') {
                var newId = $(this).children().first().attr('id');
                $(this).after('<div class="collapse" id="' + newId + '"></div>');
                lastHeader = $(this).next();                    
                $(this).replaceWith('<h2 role="button" data-toggle="collapse" href="#' + newId + '" aria-expanded="false" aria-controls="' + newId + '">' + $(this).children().first().text() +  '</h2>');

            }
            else if (lastHeader!=null) {
                lastHeader.append($(this));
            }
        }
    );
    
    return $.root().html();
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
    removeEditLinks,
    getAllLinks
}
