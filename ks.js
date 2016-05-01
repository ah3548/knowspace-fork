var express = require('express'),
    wiki = require('./ks-wiki'),
    so = require('./ks-so'),
    orm = require('./ks-orm'),
    graph = require('./ks-graph'),
    app = express();


//var Faker = require('faker');
//var randomName = Faker.Name.findName(); // Rowan Nikolaus containing many properties


var subject = "Linear_algebra";

app.use(express.static('.'));

function getQuestionsFromDB(subject) {
    return orm.getWikiEntry(subject).then(
        function(content) {
            return content;
        }
    ).catch(
        function(error) {
            console.log("Stack Overflow Question not found, fetching now..");
            return getWiki(subject).then(
                function(content) {
                    return content;
                }
            );
        }
    );
}

function insertQuestionsIntoDB(questions) {
    for (var i = 0; i < questions.length; i++) {
        insertQuestionPromise(questions[i]).then(function() {
            console.log("Insert Complete");
        });
    }
}

function insertQuestionPromise(question) {
    return new Promise(function(resolve, reject) {
        var id = question.question_id;
        orm.getQuestion(id).then(function(body) {
            console.log("Question " + id + " found");
            return body;
        }).catch (
            function(error) {
                console.log(error);
                question.tags = JSON.stringify(question.tags);
                orm.insertQuestion(question);
            }
        );
        resolve();

    })
}

function getQuestions(subject) {
    return so.getQuestions(subject).then(function(resolve, reject) {
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

app.get('/so/questions', function (req, res) {
    orm.getAllQuestions(subject).then(
        function(content) {
            res.send(content);
        }
    );
});

app.get('/wiki/:id', function (req, res) {
    wiki.getWikiEntry(req.params.id)
        .then(graph.removeMetaData)
        //.then(graph.extractText)
        .then(content => { res.send(content); });
});

app.get('/wiki/:id/links', function (req, res) {
    wiki.getWikiEntry(req.params.id)
        .then(graph.removeMetaData)
        .then(graph.getAllLinks)
        .then(content => { res.send(content); });
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
