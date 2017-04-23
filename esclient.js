//var wikipedia = require("./ks-wiki");

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  //log: 'trace'
});

function putArticle(article) {
    return client.index({
        index: 'wiki',
        type: 'document',
        id: article.title,
        body: article,
    });
}

function updateArticle(title, update) {
    console.log(title + " " + update);
    return client.update({
        index: 'wiki',
        type: 'document',
        id: title,
        script : "ctx._source.akas+=akas",
        params: {
            akas: update.akas
        }
    })
}

function getArticle(title) {
    return client.search({
        "index":"wiki",
        "type":"document",
        "body": {
            "query": {
                "query_string": {
                    "query": title,
                    "fields": ["title","akas"]
                }
            }
        }
    }).then((result) => {
        return result.hits.hits[0]._source;
    });
}

function getMoreLikeThis(title, numLike) {
    return client.search({
        "index":"wiki",
        "type":"document",
        "body": {
            "query": {
                "more_like_this" : {
                    "fields" : ["title","text"],
                    "like" : [{
                        "_index" : "wiki",
                        "_type" : "document",
                        "_id" : title
                    }],
                    "min_term_freq" : 1,
                    "min_doc_freq": 1,
                    "max_query_terms" : 10000
                }
            },
            "size": numLike
        }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        return hits.map((e) => {
            var obj = e._source;
            obj["score"] = e._score;
            return obj;
        });
    }, function (err) {
        console.trace(err.message);
    });
}

// Write Test for This
//getArticle("Cauchy–Schwarz inequality").then((response)=> console.log(response));
//getArticle("Characteristic value").then((response)=> console.log(response));

function getGraph(root, edges) {
    if (!edges.hasOwnProperty(root)) {
        return getMoreLikeThis(root, 5)
            .then((response) => {
                var nodeA = root, nodeBs = [];
                if (!edges.hasOwnProperty(nodeA)) {
                    edges[nodeA] = {};
                }
                response.forEach((e) => {
                    var nodeB = e.title;
                    if (!edges.hasOwnProperty(nodeB) || !edges[nodeB].hasOwnProperty(nodeA)) {
                        edges[nodeA][nodeB] = e.score;
                        nodeBs.push(nodeB);
                    }
                })
                return nodeBs;
            }).then((nodes) => {
                var promises = []
                nodes.forEach((nodeA) => {
                    promises.push( getGraph(nodeA, edges) );
                });
                return Promise.all(promises);
            });
    }
}

exports = module.exports = { getArticle, putArticle, updateArticle, getMoreLikeThis, getGraph };

/*client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

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
});*/