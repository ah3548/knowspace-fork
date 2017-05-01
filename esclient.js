//var wikipedia = require("./ks-wiki");

var elasticsearch = require('elasticsearch'),
    client = new elasticsearch.Client({
      host: 'localhost:9200',
      maxSockets: 100,
      //log: 'trace'
    }),
    winston = require('winston'),
    default_obj = {index: 'wiki', type: 'document'};

function getArticle(title, fields) {
    if (fields == undefined) {
        fields = ['title', 'akas', 'links'];
    }
    title = title.toLowerCase();
    var request = Object.assign({}, default_obj, {
        "body": {
            "query": {
                "bool":{
                    "should": [
                        { "term": { "title.keyword": title } },
                        { "term": { "akas.keyword": title } }
                    ]
                }
            },
            "_source": fields
        }
    });
    return client.search(request).then((result) => {
        var found = result.hits.hits;
        if (found.length > 0) {
            winston.info("Found (" + found[0]._source.title + ") with alias " + title + " in ES");
            var dataReturned = found[0]._source;
            if (fields.length == 1) {
                dataReturned = dataReturned[fields[0]];
            }
            return dataReturned;
        }
        else {
            winston.info("Could not find article: " + title);
            return {};
        }
    }).catch((error) => {
        winston.error(title + " search error: " + error);
        throw error;
    });
}

function putArticle(article) {
    article.title = article.title.toLowerCase();
    article.akas = article.akas.map( e => { return e.toLowerCase() } );
    var request = Object.assign({}, default_obj, {
        id: article.title,
        body: article
    });
    return client.create(request)
        .then((response) => {
            winston.info("New (" + article.title + ") with aliases " + article.akas);
            return response;
        })
        .catch((error) => {
            winston.log(error);
        });
}

function updateArticleAlias(title, aka) {
    var request = Object.assign({}, default_obj, {
        id: title.toLowerCase(),
        body: {
            "script": {
                "inline":"ctx._source.akas.add(params.aka)",
                "params": {
                    "aka": aka.toLowerCase()
                }
            }
        }
    });
    return client.update(request)
        .then((result) => {
            winston.log(title + " updated with new alias " + aka)
            return result;
        })
        .catch((error) => {
            winston.error(error);
            throw error;
        });
}

function getMoreLikeThis(title, numLike) {
    winston.info("Getting more like: " + title)
    title = title.toLowerCase();
    var request = Object.assign({}, default_obj, {
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
    });
    return client.search(request).then(function (resp) {
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

function getGraph(root, edges, depth) {
    if (depth === undefined) {
        depth = 2;
    }
    if (!edges.hasOwnProperty(root)) {
        return getMoreLikeThis(root, 7)
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