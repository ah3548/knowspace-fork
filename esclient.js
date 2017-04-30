//var wikipedia = require("./ks-wiki");

var elasticsearch = require('elasticsearch'),
    client = new elasticsearch.Client({
      host: 'localhost:9200',
      //log: 'trace'
    }),
    winston = require('winston');

function putArticle(article) {
    article.title = article.title.toLowerCase();
    article.akas = article.akas.map( e => { return e.toLowerCase() } );
    return client.create({
            index: 'wiki',
            type: 'document',
            id: article.title,
            body: article
        })
        .then((response) => {
            winston.info("New (" + article.title + ") with aliases " + article.akas);
            return response;
        })
        .catch((error) => {
            winston.log(error);
            throw error;
        });
}

/*function upsertArticle(article) {
    return client.update({
        index: 'wiki',
        type: 'document',
        id: article.title,
        doc: article,
        doc_as_upsert: true
    }).then(() => {
        winston.log(title + " updated with new alias " + aka)
    });
}*/

function updateArticleAlias(title, aka) {
    title = title.toLowerCase();
    aka = aka.toLowerCase();
    return client.update({
            index: 'wiki',
            type: 'document',
            id: title,
            body: {
                "script": {
                    "inline":"ctx._source.akas.add(params.aka)",
                    "params": {
                        "aka": aka
                    }
 		        }
	        }
        })
        .then((result) => {
            winston.log(title + " updated with new alias " + aka)
            return result;
        })
        .catch((error) => {
            winston.error(error);
            throw error;
        });
}

function getArticle(title) {
    title = title.toLowerCase();
    return client.search({
        "index":"wiki",
        "type":"document",
        "body": {
            "query": {
                "bool":{
                    "should": [
                        { "term": { "title.keyword": title } },
                        { "term": { "akas.keyword": title } }
                    ]
                }
            }
        }
    }).then((result) => {
        var found = result.hits.hits;
        if (found.length > 0) {
            winston.info("Found (" + found[0]._source.title + ") with alias " + title + " in ES");
            return found[0]._source;
        }
        else {
            throw new Error("Could not find article: " + title);
        }
    }).catch((error) => {
        winston.error("Could not find article: " + title);
        throw new Error("Could not find article: " + title);
    });
}

function getMoreLikeThis(title, numLike) {
    winston.info("Getting more like: " + title)
    title = title.toLowerCase();
    return client.search({
        "index":"wiki",
        "type":"document",
        "body": {
            "query": {
                "more_like_this" : {
                    "fields" : ["text"],
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
            "size": numLike,
            "_source": ["title"]
        }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        return hits.map((e) => {
            var obj = e._source;
            obj["score"] = e._score;
            return obj;
        });
    }, function (err) {
        winston.error(title + ": " + err);
        throw err;
    });
}

// Write Test for This
//getArticle("Cauchy–Schwarz inequality").then((response)=> console.log(response));
//getArticle("Characteristic value").then((response)=> console.log(response));

function getGraph(root, edges, depth) {
    if (depth === undefined) {
        depth = 2;
    }
    if (!edges.hasOwnProperty(root)) {
        return getMoreLikeThis(root, 5)
            .then((response) => {
                var nodeA = root, nodeBs = [];
                if (!edges.hasOwnProperty(nodeA)) {
                    edges[nodeA] = {};
                }
                response.forEach((e) => {
                    var nodeB = e.title;
                    if (!edges.hasOwnProperty(nodeB) ||
                        (edges.hasOwnProperty(nodeB) && !edges[nodeB].hasOwnProperty(nodeA))) {
                        edges[nodeA][nodeB] = e.score;
                        if (depth > 0) {
                            nodeBs.push(nodeB);
                        }
                    }
                })
                return nodeBs;
            })
            .catch((err) => {
                winston.info("No matches found for " + root);
                return [];
            })
            .then((nodes) => {
                var promises = []
                nodes.forEach((nodeA) => {
                    promises.push( getGraph(nodeA, edges, depth-1) );
                });
                return Promise.all(promises);
            });
    }
}

exports = module.exports = { getArticle, putArticle, updateArticleAlias, getMoreLikeThis, getGraph };

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
