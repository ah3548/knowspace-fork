//var wikipedia = require("./ks-wiki");

var elasticsearch = require('elasticsearch'),
    client = new elasticsearch.Client({
      host: 'localhost:9200',
      //log: 'trace'
    }),
    winston = require('winston');

function putArticle(article) {
    return client.create({
            index: 'wiki',
            type: 'document',
            id: article.title,
            body: article
        })
        .then((response) => {
            winston.info("New (" + article.title + ") with alias " + article.aka);
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
    return client.update({
            index: 'wiki',
            type: 'document',
            id: title,
            body: {
                "script": {
    		    "inline":"ctx._source.akas.add(params.aka)",
    		    "params": {
          		"aka": "Amir's Linear Algebra"
     		    }
 		 }
	    }
        })
        .then(() => {
            winston.log(title + " updated with new alias " + aka)
        })
        .catch((error) => {
            winston.error(error);
            throw error;
        });
}

function getArticle(title) {
    return client.search({
        "index":"wiki",
        "type":"document",
        "body": {
            "query": { 
      "bool":{ "should": [
      {
                "term": { 
                    "title.keyword": "Coordinate"
                }
            },
            {
              "term": { 
                    "akas.keyword": "Coordinate"
                }
            }
                ]
      }
  },
            "_source": ["title","akas"]
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
        winston.error(error);
        throw error;
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
