var express = require('express'),
    bodyParser = require('body-parser'),
    //cookieParser = require('cookie-parser'),
    wiki = require('./ks-wiki'),
    so = require('./ks-so'),
    orm = require('./ks-orm'),
    graph = require('./ks-graph'),
    es = require('./esclient'),
    app = express();


//var Faker = require('faker');
//var randomName = Faker.Name.findName(); // Rowan Nikolaus containing many properties
app.use(express.static('.'));

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
        // setting a property will automatically cause a Set-Cookie response
        // to be sent
        req.mySession.seenyou = true;
        res.setHeader('X-Seen-You', 'false');
    }
    next();
});

var subject = "Linear_algebra";



function getQuestionsFromDB(subject) {
    return orm.getWikiEntry(subject).then(
        function (content) {
            return content;
        }
    ).catch(
        function (error) {
            console.log("Stack Overflow Question not found, fetching now..");
            return getWiki(subject).then(
                function (content) {
                    return content;
                }
            );
        }
    );
}

function insertQuestionsIntoDB(questions) {
    for (var i = 0; i < questions.length; i++) {
        insertQuestionPromise(questions[i]).then(function () {
            console.log("Insert Complete");
        });
    }
}

function insertAnswersIntoDB(answers) {
    for (var i = 0; i < answers.length; i++) {
        insertAnswersPromise(answers[i]).then(function () {
            console.log("Insert Complete");
        });
    }
}

function insertQuestionPromise(question) {
    return new Promise(function (resolve, reject) {
        var id = question.question_id;
        orm.getQuestion(id).then(function (body) {
            if (question.answer_count != 0) {
                insertAnswersIntoDB(question.answers);
            }
            console.log("Question " + id + " found");
            return body;
        }).catch(
            function (error) {
                console.log(error);
                question.tags = JSON.stringify(question.tags);
                orm.insertQuestion(question);
            }
        );

        resolve();

    });
}

function insertAnswersPromise(answer) {
    return new Promise(function (resolve, reject) {
        var id = answer.answer_id;
        orm.getAnswer(id).then(function (body) {
            console.log("Answer " + id + " found");
            return body;
        }).catch(
            function (error) {
                console.log(error);
                orm.insertAnswer(answer); //CONTINUE HERE
            }
        );
        resolve();

    })
}

function getQuestions(subject) {
    return so.getQuestions(subject).then(function (resolve, reject) {
        insertQuestionsIntoDB(resolve)
        return resolve;
    });
    /*return wiki.getWikiEntry(subject).then(
        function(content) {
            return orm.createWikiEntry( 
            {subject:subject, content:content});
        }
    );*/
}

app.use(bodyParser.json({
    limit: '50mb'
}));
//app.use(cookieParser());

app.post('/login', function (req, res) {
    console.log(req.body);
    res.send('');
});

app.get('/graph/:title', function(req, res) {
    console.log(req.params.title);
    var edges = {};
    es.getGraph(req.params.title, edges).then(() => {
        console.log(edges);
        var adjacencyMatrix =
            Object.keys(edges).map((key) => { return {
                title: key,
                edges: Object.keys(edges[key]).map((adjacentNode) => {
                    return {
                        title: adjacentNode,
                        weight: edges[key][adjacentNode]
                    }
                })
            };})
        res.json(adjacencyMatrix);
    })
});

/*app.get('/user/graph', function (req, res) {
    var userGraph = req.query.username;

    orm.getUserGraph(userGraph).then(
        function(graph) {
            console.log(JSON.stringify(graph));
            res.json(graph);
            //res.send(JSON.stringify(graph));
        }
    ).catch(function(error) {
        res.send('');
    });
});

app.post('/user/graph', function (req, res) {
    var userGraph = req.body;
    userGraph.graph = JSON.stringify(userGraph.graph);
    orm.updateUserGraph(userGraph);
    res.send('');
});*/

app.get('/so/questions/:id', function (req, res) {
    orm.getAllQuestions(req.params.id).then(
        function (content) {
            res.send(content);
        }
    );
});

app.get('/wiki/:id', function (req, res) {
    wiki.getWikiEntry(req.params.id)
        .then(graph.removeMetaData)
        .then(graph.removeEditLinks)
        .then(graph.removeReferences)
        .then(graph.linkToCallback)
        .then(graph.splitIntro)
        //.then(graph.extractText)
        .then(content => {
            res.send(content);
        });
});

app.get('/wiki/:id/links', function (req, res) {
    wiki.getWikiEntry(req.params.id)
        .then(graph.removeMetaData)
        .then(graph.removeEditLinks)
        .then(graph.removeReferences)
        .then(graph.getAllLinks)
        .then(content => {
            res.send(content);
        });
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});

//getQuestions(subject);
