var express = require('express'),
    bodyParser = require('body-parser'),
    wiki = require('./ks-wiki'),
    graph = require('./ks-graph'),
    es = require('./esclient'),
    index = require('./index'),
    redis = require('./ks-redis').RedisClient,
    app = express();

app.use('/ks',express.static('ks-a'));

var sessions = require("client-sessions");
app.use(sessions({
    cookieName: 'mySession', // cookie name dictates the key name added to the request object
    secret: 'blargadeeblargblarg', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

app.use(function (req, res, next) {
    console.log(req.mySession);
    if (req.mySession.seenyou) {
        res.setHeader('X-Seen-You', 'true');
    } else {
        req.mySession.seenyou = true;
        res.setHeader('X-Seen-You', 'false');
    }
    next();
});

app.use(bodyParser.json({
    limit: '50mb'
}));

app.get('/wiki/:id', function (req, res) {
    redis.wrappedCall(wiki.getWiki, req.params.id)
        .then((result) => {
            if (!result) {
                return wiki.getWiki(req.params.id, ["html"])
                    .then(graph.removeMetaData)
                    .then(graph.removeEditLinks)
                    .then(graph.removeReferences)
                    .then(graph.linkToCallback)
                    .then(graph.splitIntro)
                    .then(content => {
                        redis.save(wiki.getWiki, req.params.id, content);
                        return content;
                    });
                    // .then(() => {
                    //     index.populateArticles(req.params.id);
                    // });
            }
            return result;
        })
        .then((result) => res.send(result));
});


app.get('/graph/:title', function(req, res) {
    console.log(req.params.title);
    var edges = {}
    redis.wrappedCall(es.getGraph, req.params.title)
        .then((result)=> {
            if (!result) {
                console.log('Fetching from elastic search');
                return es.getGraph(req.params.title, edges).then(() => {
                    var adjacencyMatrix =
                        Object.keys(edges).map((key) => {
                            return {
                                title: key,
                                edges: Object.keys(edges[key]).map((adjacentNode) => {
                                    return {
                                        title: adjacentNode,
                                        weight: edges[key][adjacentNode]
                                    }
                                })
                            };
                        })
                    redis.save(es.getGraph, req.params.title, adjacencyMatrix);
                    return adjacencyMatrix;
                })
            }
            return result;
        })
        .then((result) => {
            res.json(result);
        });
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});
