var wikipedia = require("./ks-wiki");

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  //log: 'trace'
});

/*client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});*/

title = "Linear_Algebra"
wikipedia.getWiki(title)
    .then( (result) => {
        client.index({
            index: 'wiki',
            type: 'document',
            id: '3',
            body: {
                "title": title,
                "text": result
            }
        }, function (err, resp, status) {
            console.log(resp);
        });
    });

client.search({
    "index":"wiki",
    "type":"document",
    "body": {
        "query": {
            "more_like_this" : {
                "fields" : ["title","text"],
                "like" : [{
                    "_index" : "wiki",
                    "_type" : "document",
                    "_id" : "1"
                }],
                "min_term_freq" : 1,
                "min_doc_freq": 1,
                "max_query_terms" : 12
            }
        }
    }
}).then(function (resp) {
    var hits = resp.hits.hits;
    console.log(hits);
}, function (err) {
    console.trace(err.message);
});