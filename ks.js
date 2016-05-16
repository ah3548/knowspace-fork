var express = require('express'),
    bodyParser = require('body-parser'),
    //cookieParser = require('cookie-parser'),
    wiki = require('./ks-wiki'),
    so = require('./ks-so'),
    orm = require('./ks-orm'),
    graph = require('./ks-graph'),
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

app.get('/user/graph', function (req, res) {
    var userGraph = req.query.username;
    /*var response = {
        "elements": {
            "nodes": [{
                "data": {
                    "id": "determinants"
                },
                "position": {
                    "x": -50.531502553590485,
                    "y": -8990.488567136874
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": "confused"
            }, {
                "data": {
                    "id": "linear algebra"
                },
                "position": {
                    "x": 584.9999999999983,
                    "y": -9012.317704015843
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "square matrix"
                },
                "position": {
                    "x": 982.5000000000001,
                    "y": -438.4901960086287
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "minor"
                },
                "position": {
                    "x": 6579.207706321929,
                    "y": 7311.161605826347
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "coefficients"
                },
                "position": {
                    "x": 4294.131299956012,
                    "y": -8237.218286918978
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "system of linear equations"
                },
                "position": {
                    "x": 1273.490196008629,
                    "y": 647.4999999999994
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "calculus"
                },
                "position": {
                    "x": 9724.412113855173,
                    "y": -1253.8867853806755
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobian determinant"
                },
                "position": {
                    "x": 1380,
                    "y": 249.9999999999998
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "change of variables"
                },
                "position": {
                    "x": 1537.3607421299353,
                    "y": -8963.226268087365
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "characteristic polynomial"
                },
                "position": {
                    "x": 584.9999999999999,
                    "y": -227
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "eigenvalue"
                },
                "position": {
                    "x": 5147.136689887874,
                    "y": -7810.858395537302
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "inverse"
                },
                "position": {
                    "x": 7162.496128275787,
                    "y": -6271.278550456372
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "product of matrices"
                },
                "position": {
                    "x": 7993.365196919361,
                    "y": -5309.375356926287
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hermitian matrix"
                },
                "position": {
                    "x": 1273.4901960086286,
                    "y": -147.50000000000034
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "real"
                },
                "position": {
                    "x": 9432.464522104858,
                    "y": -2490.9671249800103
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "minors"
                },
                "position": {
                    "x": 998.0941176051772,
                    "y": 488.5
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "identity matrix"
                },
                "position": {
                    "x": 585,
                    "y": 91
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "polynomial expression"
                },
                "position": {
                    "x": 3852.301896372213,
                    "y": 8916.906458944151
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "n!"
                },
                "position": {
                    "x": 3552.862157916613,
                    "y": 9023.95711533467
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "commutative"
                },
                "position": {
                    "x": 902.9531419701946,
                    "y": -9006.858811153847
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "linear maps"
                },
                "position": {
                    "x": 1220.5315025535765,
                    "y": -8990.488567136876
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "standard basis"
                },
                "position": {
                    "x": 171.9058823948227,
                    "y": 488.4999999999999
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "unit square"
                },
                "position": {
                    "x": 1853.0674040916208,
                    "y": -8925.104048936211
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "area"
                },
                "position": {
                    "x": 2167.2793550485812,
                    "y": -8876.16684554432
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "sine"
                },
                "position": {
                    "x": 2479.6262234737305,
                    "y": -8816.472341735289
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "cosine"
                },
                "position": {
                    "x": 2789.7398362715053,
                    "y": -8746.090901301677
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "scalar product"
                },
                "position": {
                    "x": 3097.254652755143,
                    "y": -8665.105485064967
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "equi-areal"
                },
                "position": {
                    "x": 3401.8081955209727,
                    "y": -8573.611553087047
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "bivector"
                },
                "position": {
                    "x": 3703.041477711971,
                    "y": -8471.716952148416
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "rule of Sarrus"
                },
                "position": {
                    "x": 4000.5994261668457,
                    "y": -8359.541788625806
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Leibniz formula"
                },
                "position": {
                    "x": 585,
                    "y": 409
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Laplace formula"
                },
                "position": {
                    "x": 4583.291103810949,
                    "y": -8104.890633593688
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "permutations"
                },
                "position": {
                    "x": 4867.737995959703,
                    "y": -7962.714807424423
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "symmetric group"
                },
                "position": {
                    "x": 584.9999999999999,
                    "y": -545
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "signature"
                },
                "position": {
                    "x": 5421.157849551358,
                    "y": -7649.500395869862
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Levi-Civita symbol"
                },
                "position": {
                    "x": 5689.478477575136,
                    "y": -7478.831006180529
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "triangular matrix"
                },
                "position": {
                    "x": 5951.782295980431,
                    "y": -7299.051399856562
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "n-linear function"
                },
                "position": {
                    "x": 6207.760118991569,
                    "y": -7110.373488784604
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "column vectors"
                },
                "position": {
                    "x": 6457.110217482967,
                    "y": -6913.01967356348
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "alternating form"
                },
                "position": {
                    "x": 6699.538674636753,
                    "y": -6707.222581353621
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "linearly dependent"
                },
                "position": {
                    "x": 6934.75973239181,
                    "y": -6493.224791672067
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "commutative ring"
                },
                "position": {
                    "x": 982.5000000000005,
                    "y": 938.4901960086285
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "sign"
                },
                "position": {
                    "x": 7382.479422223107,
                    "y": -6041.645472734355
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "homogeneous"
                },
                "position": {
                    "x": 7594.450312993752,
                    "y": -5804.596234250233
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "field"
                },
                "position": {
                    "x": 7798.158943819771,
                    "y": -5560.410252410595
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Gaussian elimination"
                },
                "position": {
                    "x": 585.0000000000002,
                    "y": 1045
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "main diagonal"
                },
                "position": {
                    "x": 8179.838976531245,
                    "y": -5051.787450538463
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "matrix product"
                },
                "position": {
                    "x": 8357.360480135787,
                    "y": -4787.950160228733
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cauchy–Binet formula"
                },
                "position": {
                    "x": 187.50000000000063,
                    "y": 938.4901960086291
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "rank"
                },
                "position": {
                    "x": 8684.720457543168,
                    "y": -4242.778400920973
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "special linear group"
                },
                "position": {
                    "x": 8834.173061825859,
                    "y": -3962.086543053443
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "matrix group"
                },
                "position": {
                    "x": 8973.902105897465,
                    "y": -3676.4297660590337
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "special orthogonal group"
                },
                "position": {
                    "x": 9103.742886731023,
                    "y": -3386.1447825815367
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "rotation matrices"
                },
                "position": {
                    "x": 9223.542356907014,
                    "y": -3091.5737606775556
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "special unitary group"
                },
                "position": {
                    "x": 9333.159305015175,
                    "y": -2793.0639204922595
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Laplace's formula"
                },
                "position": {
                    "x": -103.49019600862891,
                    "y": 647.4999999999998
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "cofactor"
                },
                "position": {
                    "x": 9521.340953987668,
                    "y": -2185.6394651524433
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "adjugate matrix"
                },
                "position": {
                    "x": 9599.683839212945,
                    "y": -1877.440840342755
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Sylvester's determinant theorem"
                },
                "position": {
                    "x": 9667.40083255336,
                    "y": -1566.7345339810515
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "eigenvalues"
                },
                "position": {
                    "x": -210,
                    "y": 250.00000000000028
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "algebraic multiplicities"
                },
                "position": {
                    "x": 9770.650482124747,
                    "y": -939.2663580404103
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "pseudo-determinant"
                },
                "position": {
                    "x": 9806.061434740477,
                    "y": -623.2441049713501
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "characteristic equation"
                },
                "position": {
                    "x": 9830.60323169675,
                    "y": -306.1925315607209
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "positive definite"
                },
                "position": {
                    "x": 9844.246944804208,
                    "y": 11.514643511923538
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Sylvester's criterion"
                },
                "position": {
                    "x": 9846.976491788311,
                    "y": 329.50292878869305
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "trace"
                },
                "position": {
                    "x": 9838.788655246026,
                    "y": 647.3975014582506
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "matrix exponential"
                },
                "position": {
                    "x": 9819.693086438272,
                    "y": 964.8236491712374
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "logarithm"
                },
                "position": {
                    "x": 9789.712293913686,
                    "y": 1281.4072117255835
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cayley-Hamilton theorem"
                },
                "position": {
                    "x": 9748.881616977083,
                    "y": 1596.7750221008616
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Newton's identities"
                },
                "position": {
                    "x": 9697.2491840339,
                    "y": 1910.5553463220692
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Faddeev–LeVerrier algorithm"
                },
                "position": {
                    "x": 9634.875855859736,
                    "y": 2222.378321634147
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Bell polynomial"
                },
                "position": {
                    "x": 9561.835153861824,
                    "y": 2531.876392470866
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Mercator series"
                },
                "position": {
                    "x": 9478.213173417053,
                    "y": 2838.6847437041693
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "multivariate normal"
                },
                "position": {
                    "x": 9384.108482388614,
                    "y": 3142.4417306632195
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cramer's rule"
                },
                "position": {
                    "x": 9279.63200494097,
                    "y": 3442.789305416422
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "LU"
                },
                "position": {
                    "x": 9164.906890790031,
                    "y": 3739.373438813773
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "QR"
                },
                "position": {
                    "x": 9040.068370042725,
                    "y": 4031.844537792156
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "singular value decomposition"
                },
                "position": {
                    "x": 8905.26359379699,
                    "y": 4319.857857451744
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "invertible"
                },
                "position": {
                    "x": 8760.65146069015,
                    "y": 4603.073907417645
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "polynomial"
                },
                "position": {
                    "x": 8606.402429600079,
                    "y": 4881.158852007915
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "differentiable"
                },
                "position": {
                    "x": 8442.698318719951,
                    "y": 5153.784903736193
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobi's formula"
                },
                "position": {
                    "x": 8269.732091243415,
                    "y": 5420.630709685124
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "adjugate"
                },
                "position": {
                    "x": 8087.707627912788,
                    "y": 5681.381730295208
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "big O notation"
                },
                "position": {
                    "x": 7896.839486698408,
                    "y": 5935.730610122438
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "tangent space"
                },
                "position": {
                    "x": 7697.352649892384,
                    "y": 6183.37754012789
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Lie groups"
                },
                "position": {
                    "x": 7489.482258914888,
                    "y": 6424.030611072063
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "cross product"
                },
                "position": {
                    "x": 7273.4733371455495,
                    "y": 6657.406157597501
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "similar matrices"
                },
                "position": {
                    "x": 7049.580501106678,
                    "y": 6883.229092594092
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "similarity invariant"
                },
                "position": {
                    "x": 6818.067660338759,
                    "y": 7101.233231452891
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "linear transformation"
                },
                "position": {
                    "x": -103.49019600862914,
                    "y": -147.49999999999932
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "vector space"
                },
                "position": {
                    "x": 6333.282190810237,
                    "y": 7512.766766524943
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "basis"
                },
                "position": {
                    "x": 6080.580993957673,
                    "y": 7705.8110751933955
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "exterior power"
                },
                "position": {
                    "x": 5821.40198262733,
                    "y": 7890.066984422445
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "vector bundles"
                },
                "position": {
                    "x": 5556.050659286328,
                    "y": 8065.317305966168
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "chain complexes"
                },
                "position": {
                    "x": 5284.839801900436,
                    "y": 8231.3554667486
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "n-linear"
                },
                "position": {
                    "x": 5008.089095252849,
                    "y": 8387.985752357929
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "alternating"
                },
                "position": {
                    "x": 4726.124754121613,
                    "y": 8535.023537741248
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "invertible element"
                },
                "position": {
                    "x": 4439.279138760044,
                    "y": 8672.295504827911
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "unimodular"
                },
                "position": {
                    "x": 4147.890363133178,
                    "y": 8799.639846825014
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "multiplicative group"
                },
                "position": {
                    "x": 187.49999999999892,
                    "y": -438.4901960086281
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "group homomorphism"
                },
                "position": {
                    "x": 8525.720457543168,
                    "y": -4518.1744793244225
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "ring homomorphism"
                },
                "position": {
                    "x": 3249.9241068211395,
                    "y": 9120.665632014818
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "complex conjugate"
                },
                "position": {
                    "x": 2943.844825711883,
                    "y": 9206.918015608806
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "modular arithmetic"
                },
                "position": {
                    "x": 2634.9850998817506,
                    "y": 9282.612597714358
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "category theory"
                },
                "position": {
                    "x": 2323.708992021421,
                    "y": 9347.66015474249
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "natural transformation"
                },
                "position": {
                    "x": 2010.3834130872406,
                    "y": 9401.98401308815
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "algebraic groups"
                },
                "position": {
                    "x": 1695.3776898116632,
                    "y": 9445.520139507815
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Functional analysis"
                },
                "position": {
                    "x": 1379.0631293662261,
                    "y": 9478.217216597495
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Fredholm determinant"
                },
                "position": {
                    "x": 1061.8125816900783,
                    "y": 9500.036703282174
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "trace class operators"
                },
                "position": {
                    "x": 744.0000000000017,
                    "y": 9510.952880245386
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "functional determinant"
                },
                "position": {
                    "x": 426.000000000004,
                    "y": 9510.952880245386
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "regular element"
                },
                "position": {
                    "x": 108.1874183099273,
                    "y": 9500.036703282174
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "quasideterminants"
                },
                "position": {
                    "x": -209.06312936622044,
                    "y": 9478.217216597495
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Dieudonné determinant"
                },
                "position": {
                    "x": -525.3776898116575,
                    "y": 9445.520139507815
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Capelli determinant"
                },
                "position": {
                    "x": -840.3834130872349,
                    "y": 9401.984013088151
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Berezinian"
                },
                "position": {
                    "x": -1153.7089920214153,
                    "y": 9347.660154742493
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Manin matrices"
                },
                "position": {
                    "x": -1464.985099881737,
                    "y": 9282.61259771436
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "superrings"
                },
                "position": {
                    "x": -1773.8448257118848,
                    "y": 9206.918015608806
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "graded rings"
                },
                "position": {
                    "x": -2079.924106821134,
                    "y": 9120.665632014821
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Berezinians"
                },
                "position": {
                    "x": -2382.8621579166074,
                    "y": 9023.95711533467
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "permanent"
                },
                "position": {
                    "x": -2682.3018963722075,
                    "y": 8916.906458944153
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "immanant"
                },
                "position": {
                    "x": -2977.8903631331727,
                    "y": 8799.639846825015
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "character"
                },
                "position": {
                    "x": -3269.279138760038,
                    "y": 8672.295504827915
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "numerical linear algebra"
                },
                "position": {
                    "x": -3556.124754121607,
                    "y": 8535.023537741252
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "of order"
                },
                "position": {
                    "x": -3838.0890952528507,
                    "y": 8387.985752357927
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "factorial"
                },
                "position": {
                    "x": -4114.839801900439,
                    "y": 8231.355466748599
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "LU decomposition"
                },
                "position": {
                    "x": -4386.050659286324,
                    "y": 8065.317305966171
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "QR decomposition"
                },
                "position": {
                    "x": -4651.401982627324,
                    "y": 7890.066984422449
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cholesky decomposition"
                },
                "position": {
                    "x": -4910.580993957669,
                    "y": 7705.811075193398
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "positive definite matrices"
                },
                "position": {
                    "x": -5163.282190810231,
                    "y": 7512.766766524946
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "permutation matrix"
                },
                "position": {
                    "x": -5409.207706321924,
                    "y": 7311.16160582635
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "determinant identities"
                },
                "position": {
                    "x": -5648.06766033876,
                    "y": 7101.2332314528885
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "unitriangular matrix"
                },
                "position": {
                    "x": -5879.580501106668,
                    "y": 6883.229092594101
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "matrix determinant lemma"
                },
                "position": {
                    "x": -6103.473337145547,
                    "y": 6657.406157597506
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Coppersmith–Winograd algorithm"
                },
                "position": {
                    "x": -6319.4822589148835,
                    "y": 6424.030611072068
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "bit complexity"
                },
                "position": {
                    "x": -6527.35264989238,
                    "y": 6183.377540127894
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Bareiss Algorithm"
                },
                "position": {
                    "x": -6726.839486698405,
                    "y": 5935.730610122442
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Sylvester's identity"
                },
                "position": {
                    "x": -6917.707627912783,
                    "y": 5681.381730295213
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "The Nine Chapters on the Mathematical Art"
                },
                "position": {
                    "x": -7099.732091243417,
                    "y": 5420.630709685122
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cardano"
                },
                "position": {
                    "x": -7272.698318719943,
                    "y": 5153.784903736206
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Leibniz"
                },
                "position": {
                    "x": -7436.402429600076,
                    "y": 4881.158852007919
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Seki Takakazu"
                },
                "position": {
                    "x": -7590.651460690147,
                    "y": 4603.073907417651
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cramer"
                },
                "position": {
                    "x": -7735.263593796988,
                    "y": 4319.85785745175
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Bézout"
                },
                "position": {
                    "x": -7870.0683700427235,
                    "y": 4031.8445377921616
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Vandermonde"
                },
                "position": {
                    "x": -7994.906890790027,
                    "y": 3739.3734388137786
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Laplace"
                },
                "position": {
                    "x": -8109.6320049409715,
                    "y": 3442.789305416419
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Lagrange"
                },
                "position": {
                    "x": -8214.10848238861,
                    "y": 3142.441730663233
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "elimination theory"
                },
                "position": {
                    "x": -8308.213173417053,
                    "y": 2838.6847437041665
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Gauss"
                },
                "position": {
                    "x": -8391.835153861824,
                    "y": 2531.876392470872
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "theory of numbers"
                },
                "position": {
                    "x": -8464.875855859733,
                    "y": 2222.378321634152
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "discriminant"
                },
                "position": {
                    "x": -8527.2491840339,
                    "y": 1910.555346322075
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "quantic"
                },
                "position": {
                    "x": -8578.881616977083,
                    "y": 1596.7750221008673
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Binet"
                },
                "position": {
                    "x": -8619.712293913688,
                    "y": 1281.4072117255728
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cauchy"
                },
                "position": {
                    "x": -8649.693086438272,
                    "y": 964.8236491712513
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobi"
                },
                "position": {
                    "x": -8668.788655246026,
                    "y": 647.397501458248
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobian"
                },
                "position": {
                    "x": -8676.976491788311,
                    "y": 329.50292878871517
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Crelle"
                },
                "position": {
                    "x": -8674.246944804208,
                    "y": 11.514643511929222
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Sylvester"
                },
                "position": {
                    "x": -8660.60323169675,
                    "y": -306.1925315607152
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cayley"
                },
                "position": {
                    "x": -8636.061434740477,
                    "y": -623.2441049713445
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Lebesgue"
                },
                "position": {
                    "x": -8600.650482124745,
                    "y": -939.266358040421
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hesse"
                },
                "position": {
                    "x": -8554.412113855176,
                    "y": -1253.8867853806619
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "persymmetric"
                },
                "position": {
                    "x": -8497.40083255336,
                    "y": -1566.734533981054
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hankel"
                },
                "position": {
                    "x": -8429.683839212947,
                    "y": -1877.4408403427415
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "circulants"
                },
                "position": {
                    "x": -8351.34095398767,
                    "y": -2185.639465152438
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Catalan"
                },
                "position": {
                    "x": -8262.46452210486,
                    "y": -2490.9671249800053
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Spottiswoode"
                },
                "position": {
                    "x": -8163.159305015177,
                    "y": -2793.063920492254
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Glaisher"
                },
                "position": {
                    "x": -8053.542356907015,
                    "y": -3091.5737606775506
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Pfaffians"
                },
                "position": {
                    "x": -7933.742886731026,
                    "y": -3386.144782581524
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "orthogonal transformation"
                },
                "position": {
                    "x": -7803.902105897463,
                    "y": -3676.429766059036
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Wronskians"
                },
                "position": {
                    "x": -7664.173061825864,
                    "y": -3962.0865430534304
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Muir"
                },
                "position": {
                    "x": -7514.720457543171,
                    "y": -4242.778400920967
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Christoffel"
                },
                "position": {
                    "x": -7355.7204575431715,
                    "y": -4518.174479324417
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Frobenius"
                },
                "position": {
                    "x": -7187.36048013579,
                    "y": -4787.950160228727
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hessians"
                },
                "position": {
                    "x": -7009.838976531249,
                    "y": -5051.787450538459
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Trudi"
                },
                "position": {
                    "x": -6823.365196919369,
                    "y": -5309.375356926275
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "plane"
                },
                "position": {
                    "x": -6628.158943819769,
                    "y": -5560.410252410597
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "spanned"
                },
                "position": {
                    "x": -6424.450312993762,
                    "y": -5804.596234250222
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "differential equations"
                },
                "position": {
                    "x": -6212.479422223111,
                    "y": -6041.645472734352
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Wronskian"
                },
                "position": {
                    "x": -5992.49612827579,
                    "y": -6271.278550456367
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "analytic functions"
                },
                "position": {
                    "x": -5764.759732391814,
                    "y": -6493.2247916720635
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "the Wronskian and linear independence"
                },
                "position": {
                    "x": -5529.538674636757,
                    "y": -6707.222581353617
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "sequence"
                },
                "position": {
                    "x": -5287.110217482971,
                    "y": -6913.019673563476
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "orthogonal matrix"
                },
                "position": {
                    "x": -5037.760118991566,
                    "y": -7110.373488784605
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "orthonormal basis"
                },
                "position": {
                    "x": -4781.7822959804425,
                    "y": -7299.051399856554
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Euclidean space"
                },
                "position": {
                    "x": -4519.478477575134,
                    "y": -7478.8310061805305
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "orientation"
                },
                "position": {
                    "x": -4251.157849551363,
                    "y": -7649.500395869858
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "rotation"
                },
                "position": {
                    "x": -3977.1366898878796,
                    "y": -7810.8583955373
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "absolute value"
                },
                "position": {
                    "x": -3697.7379959597083,
                    "y": -7962.714807424421
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "parallelepiped"
                },
                "position": {
                    "x": -3413.2911038109532,
                    "y": -8104.890633593686
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "measurable"
                },
                "position": {
                    "x": -3124.131299956009,
                    "y": -8237.21828691898
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "subset"
                },
                "position": {
                    "x": -2830.599426166859,
                    "y": -8359.5417886258
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "dimensional"
                },
                "position": {
                    "x": -2533.041477711968,
                    "y": -8471.716952148417
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "tetrahedron"
                },
                "position": {
                    "x": -2231.8081955209786,
                    "y": -8573.611553087043
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "skew lines"
                },
                "position": {
                    "x": -1927.2546527551485,
                    "y": -8665.105485064963
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "spanning tree"
                },
                "position": {
                    "x": -1619.7398362715107,
                    "y": -8746.090901301675
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "differentiable function"
                },
                "position": {
                    "x": -1309.626223473736,
                    "y": -8816.472341735289
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobian matrix"
                },
                "position": {
                    "x": -997.2793550485785,
                    "y": -8876.16684554432
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "integration by substitution"
                },
                "position": {
                    "x": -683.0674040916344,
                    "y": -8925.10404893621
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "open subset"
                },
                "position": {
                    "x": -367.36074212993276,
                    "y": -8963.226268087365
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "inverse function theorem"
                },
                "position": {
                    "x": 267.0468580297997,
                    "y": -9006.858811153845
                },
                "group": "nodes",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }],
            "edges": [{
                "data": {
                    "id": "determinants,linear algebra",
                    "source": "determinants",
                    "target": "linear algebra"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "linear algebra,square matrix",
                    "source": "linear algebra",
                    "target": "square matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "square matrix,minor",
                    "source": "square matrix",
                    "target": "minor"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "minor,coefficients",
                    "source": "minor",
                    "target": "coefficients"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "coefficients,system of linear equations",
                    "source": "coefficients",
                    "target": "system of linear equations"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "system of linear equations,calculus",
                    "source": "system of linear equations",
                    "target": "calculus"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "calculus,Jacobian determinant",
                    "source": "calculus",
                    "target": "Jacobian determinant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobian determinant,change of variables",
                    "source": "Jacobian determinant",
                    "target": "change of variables"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "change of variables,characteristic polynomial",
                    "source": "change of variables",
                    "target": "characteristic polynomial"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "characteristic polynomial,eigenvalue",
                    "source": "characteristic polynomial",
                    "target": "eigenvalue"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "eigenvalue,inverse",
                    "source": "eigenvalue",
                    "target": "inverse"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "inverse,product of matrices",
                    "source": "inverse",
                    "target": "product of matrices"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "product of matrices,Hermitian matrix",
                    "source": "product of matrices",
                    "target": "Hermitian matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hermitian matrix,real",
                    "source": "Hermitian matrix",
                    "target": "real"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "real,square matrix",
                    "source": "real",
                    "target": "square matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "square matrix,minors",
                    "source": "square matrix",
                    "target": "minors"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "minors,identity matrix",
                    "source": "minors",
                    "target": "identity matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "identity matrix,polynomial expression",
                    "source": "identity matrix",
                    "target": "polynomial expression"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "polynomial expression,n!",
                    "source": "polynomial expression",
                    "target": "n!"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "n!,characteristic polynomial",
                    "source": "n!",
                    "target": "characteristic polynomial"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "characteristic polynomial,commutative",
                    "source": "characteristic polynomial",
                    "target": "commutative"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "commutative,linear maps",
                    "source": "commutative",
                    "target": "linear maps"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "linear maps,standard basis",
                    "source": "linear maps",
                    "target": "standard basis"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "standard basis,unit square",
                    "source": "standard basis",
                    "target": "unit square"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "unit square,area",
                    "source": "unit square",
                    "target": "area"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "area,identity matrix",
                    "source": "area",
                    "target": "identity matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "identity matrix,sine",
                    "source": "identity matrix",
                    "target": "sine"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "sine,cosine",
                    "source": "sine",
                    "target": "cosine"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "cosine,scalar product",
                    "source": "cosine",
                    "target": "scalar product"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "scalar product,equi-areal",
                    "source": "scalar product",
                    "target": "equi-areal"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "equi-areal,bivector",
                    "source": "equi-areal",
                    "target": "bivector"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "bivector,rule of Sarrus",
                    "source": "bivector",
                    "target": "rule of Sarrus"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "rule of Sarrus,Leibniz formula",
                    "source": "rule of Sarrus",
                    "target": "Leibniz formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Leibniz formula,Laplace formula",
                    "source": "Leibniz formula",
                    "target": "Laplace formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Laplace formula,permutations",
                    "source": "Laplace formula",
                    "target": "permutations"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "permutations,symmetric group",
                    "source": "permutations",
                    "target": "symmetric group"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "symmetric group,signature",
                    "source": "symmetric group",
                    "target": "signature"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "signature,Levi-Civita symbol",
                    "source": "signature",
                    "target": "Levi-Civita symbol"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Levi-Civita symbol,identity matrix",
                    "source": "Levi-Civita symbol",
                    "target": "identity matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "identity matrix,triangular matrix",
                    "source": "identity matrix",
                    "target": "triangular matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "triangular matrix,n-linear function",
                    "source": "triangular matrix",
                    "target": "n-linear function"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "n-linear function,column vectors",
                    "source": "n-linear function",
                    "target": "column vectors"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "column vectors,alternating form",
                    "source": "column vectors",
                    "target": "alternating form"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "alternating form,linearly dependent",
                    "source": "alternating form",
                    "target": "linearly dependent"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "linearly dependent,commutative ring",
                    "source": "linearly dependent",
                    "target": "commutative ring"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "commutative ring,standard basis",
                    "source": "commutative ring",
                    "target": "standard basis"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "standard basis,sign",
                    "source": "standard basis",
                    "target": "sign"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "sign,homogeneous",
                    "source": "sign",
                    "target": "homogeneous"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "homogeneous,field",
                    "source": "homogeneous",
                    "target": "field"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "field,Gaussian elimination",
                    "source": "field",
                    "target": "Gaussian elimination"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Gaussian elimination,main diagonal",
                    "source": "Gaussian elimination",
                    "target": "main diagonal"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "main diagonal,matrix product",
                    "source": "main diagonal",
                    "target": "matrix product"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "matrix product,Cauchy–Binet formula",
                    "source": "matrix product",
                    "target": "Cauchy–Binet formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cauchy–Binet formula,rank",
                    "source": "Cauchy–Binet formula",
                    "target": "rank"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "rank,special linear group",
                    "source": "rank",
                    "target": "special linear group"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "special linear group,matrix group",
                    "source": "special linear group",
                    "target": "matrix group"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "matrix group,special orthogonal group",
                    "source": "matrix group",
                    "target": "special orthogonal group"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "special orthogonal group,rotation matrices",
                    "source": "special orthogonal group",
                    "target": "rotation matrices"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "rotation matrices,special unitary group",
                    "source": "rotation matrices",
                    "target": "special unitary group"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "special unitary group,Laplace's formula",
                    "source": "special unitary group",
                    "target": "Laplace's formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Laplace's formula,minors",
                    "source": "Laplace's formula",
                    "target": "minors"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "minors,cofactor",
                    "source": "minors",
                    "target": "cofactor"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "cofactor,adjugate matrix",
                    "source": "cofactor",
                    "target": "adjugate matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "adjugate matrix,Sylvester's determinant theorem",
                    "source": "adjugate matrix",
                    "target": "Sylvester's determinant theorem"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Sylvester's determinant theorem,eigenvalues",
                    "source": "Sylvester's determinant theorem",
                    "target": "eigenvalues"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "eigenvalues,algebraic multiplicities",
                    "source": "eigenvalues",
                    "target": "algebraic multiplicities"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "algebraic multiplicities,pseudo-determinant",
                    "source": "algebraic multiplicities",
                    "target": "pseudo-determinant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "pseudo-determinant,eigenvalues",
                    "source": "pseudo-determinant",
                    "target": "eigenvalues"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "eigenvalues,characteristic equation",
                    "source": "eigenvalues",
                    "target": "characteristic equation"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "characteristic equation,identity matrix",
                    "source": "characteristic equation",
                    "target": "identity matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "identity matrix,Hermitian matrix",
                    "source": "identity matrix",
                    "target": "Hermitian matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hermitian matrix,positive definite",
                    "source": "Hermitian matrix",
                    "target": "positive definite"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "positive definite,Sylvester's criterion",
                    "source": "positive definite",
                    "target": "Sylvester's criterion"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Sylvester's criterion,trace",
                    "source": "Sylvester's criterion",
                    "target": "trace"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "trace,matrix exponential",
                    "source": "trace",
                    "target": "matrix exponential"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "matrix exponential,logarithm",
                    "source": "matrix exponential",
                    "target": "logarithm"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "logarithm,Cayley-Hamilton theorem",
                    "source": "logarithm",
                    "target": "Cayley-Hamilton theorem"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cayley-Hamilton theorem,Newton's identities",
                    "source": "Cayley-Hamilton theorem",
                    "target": "Newton's identities"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Newton's identities,Faddeev–LeVerrier algorithm",
                    "source": "Newton's identities",
                    "target": "Faddeev–LeVerrier algorithm"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Faddeev–LeVerrier algorithm,characteristic polynomial",
                    "source": "Faddeev–LeVerrier algorithm",
                    "target": "characteristic polynomial"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "characteristic polynomial,Bell polynomial",
                    "source": "characteristic polynomial",
                    "target": "Bell polynomial"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Bell polynomial,Mercator series",
                    "source": "Bell polynomial",
                    "target": "Mercator series"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Mercator series,multivariate normal",
                    "source": "Mercator series",
                    "target": "multivariate normal"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "multivariate normal,Cramer's rule",
                    "source": "multivariate normal",
                    "target": "Cramer's rule"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cramer's rule,LU",
                    "source": "Cramer's rule",
                    "target": "LU"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "LU,QR",
                    "source": "LU",
                    "target": "QR"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "QR,singular value decomposition",
                    "source": "QR",
                    "target": "singular value decomposition"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "singular value decomposition,Leibniz formula",
                    "source": "singular value decomposition",
                    "target": "Leibniz formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Leibniz formula,invertible",
                    "source": "Leibniz formula",
                    "target": "invertible"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "invertible,Leibniz formula",
                    "source": "invertible",
                    "target": "Leibniz formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Leibniz formula,polynomial",
                    "source": "Leibniz formula",
                    "target": "polynomial"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "polynomial,differentiable",
                    "source": "polynomial",
                    "target": "differentiable"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "differentiable,Jacobi's formula",
                    "source": "differentiable",
                    "target": "Jacobi's formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobi's formula,adjugate",
                    "source": "Jacobi's formula",
                    "target": "adjugate"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "adjugate,big O notation",
                    "source": "adjugate",
                    "target": "big O notation"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "big O notation,tangent space",
                    "source": "big O notation",
                    "target": "tangent space"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "tangent space,Lie groups",
                    "source": "tangent space",
                    "target": "Lie groups"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Lie groups,cross product",
                    "source": "Lie groups",
                    "target": "cross product"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "cross product,similar matrices",
                    "source": "cross product",
                    "target": "similar matrices"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "similar matrices,similarity invariant",
                    "source": "similar matrices",
                    "target": "similarity invariant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "similarity invariant,linear transformation",
                    "source": "similarity invariant",
                    "target": "linear transformation"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "linear transformation,vector space",
                    "source": "linear transformation",
                    "target": "vector space"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "vector space,basis",
                    "source": "vector space",
                    "target": "basis"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "basis,exterior power",
                    "source": "basis",
                    "target": "exterior power"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "exterior power,vector bundles",
                    "source": "exterior power",
                    "target": "vector bundles"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "vector bundles,chain complexes",
                    "source": "vector bundles",
                    "target": "chain complexes"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "chain complexes,n-linear",
                    "source": "chain complexes",
                    "target": "n-linear"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "n-linear,alternating",
                    "source": "n-linear",
                    "target": "alternating"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "alternating,commutative ring",
                    "source": "alternating",
                    "target": "commutative ring"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "commutative ring,invertible element",
                    "source": "commutative ring",
                    "target": "invertible element"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "invertible element,unimodular",
                    "source": "invertible element",
                    "target": "unimodular"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "unimodular,multiplicative group",
                    "source": "unimodular",
                    "target": "multiplicative group"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "multiplicative group,group homomorphism",
                    "source": "multiplicative group",
                    "target": "group homomorphism"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "group homomorphism,ring homomorphism",
                    "source": "group homomorphism",
                    "target": "ring homomorphism"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "ring homomorphism,complex conjugate",
                    "source": "ring homomorphism",
                    "target": "complex conjugate"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "complex conjugate,modular arithmetic",
                    "source": "complex conjugate",
                    "target": "modular arithmetic"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "modular arithmetic,category theory",
                    "source": "modular arithmetic",
                    "target": "category theory"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "category theory,natural transformation",
                    "source": "category theory",
                    "target": "natural transformation"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "natural transformation,algebraic groups",
                    "source": "natural transformation",
                    "target": "algebraic groups"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "algebraic groups,multiplicative group",
                    "source": "algebraic groups",
                    "target": "multiplicative group"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "multiplicative group,Functional analysis",
                    "source": "multiplicative group",
                    "target": "Functional analysis"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Functional analysis,Fredholm determinant",
                    "source": "Functional analysis",
                    "target": "Fredholm determinant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Fredholm determinant,trace class operators",
                    "source": "Fredholm determinant",
                    "target": "trace class operators"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "trace class operators,functional determinant",
                    "source": "trace class operators",
                    "target": "functional determinant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "functional determinant,regular element",
                    "source": "functional determinant",
                    "target": "regular element"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "regular element,quasideterminants",
                    "source": "regular element",
                    "target": "quasideterminants"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "quasideterminants,Dieudonné determinant",
                    "source": "quasideterminants",
                    "target": "Dieudonné determinant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Dieudonné determinant,Capelli determinant",
                    "source": "Dieudonné determinant",
                    "target": "Capelli determinant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Capelli determinant,Berezinian",
                    "source": "Capelli determinant",
                    "target": "Berezinian"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Berezinian,Manin matrices",
                    "source": "Berezinian",
                    "target": "Manin matrices"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Manin matrices,superrings",
                    "source": "Manin matrices",
                    "target": "superrings"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "superrings,graded rings",
                    "source": "superrings",
                    "target": "graded rings"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "graded rings,Berezinians",
                    "source": "graded rings",
                    "target": "Berezinians"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Berezinians,permanent",
                    "source": "Berezinians",
                    "target": "permanent"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "permanent,immanant",
                    "source": "permanent",
                    "target": "immanant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "immanant,character",
                    "source": "immanant",
                    "target": "character"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "character,symmetric group",
                    "source": "character",
                    "target": "symmetric group"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "symmetric group,numerical linear algebra",
                    "source": "symmetric group",
                    "target": "numerical linear algebra"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "numerical linear algebra,Leibniz formula",
                    "source": "numerical linear algebra",
                    "target": "Leibniz formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Leibniz formula,Laplace's formula",
                    "source": "Leibniz formula",
                    "target": "Laplace's formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Laplace's formula,of order",
                    "source": "Laplace's formula",
                    "target": "of order"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "of order,factorial",
                    "source": "of order",
                    "target": "factorial"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "factorial,LU decomposition",
                    "source": "factorial",
                    "target": "LU decomposition"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "LU decomposition,QR decomposition",
                    "source": "LU decomposition",
                    "target": "QR decomposition"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "QR decomposition,Cholesky decomposition",
                    "source": "QR decomposition",
                    "target": "Cholesky decomposition"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cholesky decomposition,positive definite matrices",
                    "source": "Cholesky decomposition",
                    "target": "positive definite matrices"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "positive definite matrices,permutation matrix",
                    "source": "positive definite matrices",
                    "target": "permutation matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "permutation matrix,determinant identities",
                    "source": "permutation matrix",
                    "target": "determinant identities"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "determinant identities,unitriangular matrix",
                    "source": "determinant identities",
                    "target": "unitriangular matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "unitriangular matrix,matrix determinant lemma",
                    "source": "unitriangular matrix",
                    "target": "matrix determinant lemma"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "matrix determinant lemma,Coppersmith–Winograd algorithm",
                    "source": "matrix determinant lemma",
                    "target": "Coppersmith–Winograd algorithm"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Coppersmith–Winograd algorithm,bit complexity",
                    "source": "Coppersmith–Winograd algorithm",
                    "target": "bit complexity"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "bit complexity,Gaussian elimination",
                    "source": "bit complexity",
                    "target": "Gaussian elimination"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Gaussian elimination,Bareiss Algorithm",
                    "source": "Gaussian elimination",
                    "target": "Bareiss Algorithm"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Bareiss Algorithm,Sylvester's identity",
                    "source": "Bareiss Algorithm",
                    "target": "Sylvester's identity"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Sylvester's identity,system of linear equations",
                    "source": "Sylvester's identity",
                    "target": "system of linear equations"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "system of linear equations,The Nine Chapters on the Mathematical Art",
                    "source": "system of linear equations",
                    "target": "The Nine Chapters on the Mathematical Art"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "The Nine Chapters on the Mathematical Art,Cardano",
                    "source": "The Nine Chapters on the Mathematical Art",
                    "target": "Cardano"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cardano,Leibniz",
                    "source": "Cardano",
                    "target": "Leibniz"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Leibniz,Seki Takakazu",
                    "source": "Leibniz",
                    "target": "Seki Takakazu"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Seki Takakazu,Cramer",
                    "source": "Seki Takakazu",
                    "target": "Cramer"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cramer,Bézout",
                    "source": "Cramer",
                    "target": "Bézout"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Bézout,Vandermonde",
                    "source": "Bézout",
                    "target": "Vandermonde"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Vandermonde,Laplace",
                    "source": "Vandermonde",
                    "target": "Laplace"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Laplace,minors",
                    "source": "Laplace",
                    "target": "minors"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "minors,Lagrange",
                    "source": "minors",
                    "target": "Lagrange"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Lagrange,elimination theory",
                    "source": "Lagrange",
                    "target": "elimination theory"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "elimination theory,Gauss",
                    "source": "elimination theory",
                    "target": "Gauss"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Gauss,theory of numbers",
                    "source": "Gauss",
                    "target": "theory of numbers"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "theory of numbers,discriminant",
                    "source": "theory of numbers",
                    "target": "discriminant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "discriminant,quantic",
                    "source": "discriminant",
                    "target": "quantic"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "quantic,Binet",
                    "source": "quantic",
                    "target": "Binet"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Binet,Cauchy",
                    "source": "Binet",
                    "target": "Cauchy"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cauchy,Cauchy–Binet formula",
                    "source": "Cauchy",
                    "target": "Cauchy–Binet formula"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cauchy–Binet formula,Jacobi",
                    "source": "Cauchy–Binet formula",
                    "target": "Jacobi"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobi,Jacobian",
                    "source": "Jacobi",
                    "target": "Jacobian"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobian,Crelle",
                    "source": "Jacobian",
                    "target": "Crelle"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Crelle,Sylvester",
                    "source": "Crelle",
                    "target": "Sylvester"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Sylvester,Cayley",
                    "source": "Sylvester",
                    "target": "Cayley"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Cayley,Lebesgue",
                    "source": "Cayley",
                    "target": "Lebesgue"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Lebesgue,Hesse",
                    "source": "Lebesgue",
                    "target": "Hesse"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hesse,persymmetric",
                    "source": "Hesse",
                    "target": "persymmetric"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "persymmetric,Hankel",
                    "source": "persymmetric",
                    "target": "Hankel"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hankel,circulants",
                    "source": "Hankel",
                    "target": "circulants"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "circulants,Catalan",
                    "source": "circulants",
                    "target": "Catalan"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Catalan,Spottiswoode",
                    "source": "Catalan",
                    "target": "Spottiswoode"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Spottiswoode,Glaisher",
                    "source": "Spottiswoode",
                    "target": "Glaisher"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Glaisher,Pfaffians",
                    "source": "Glaisher",
                    "target": "Pfaffians"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Pfaffians,orthogonal transformation",
                    "source": "Pfaffians",
                    "target": "orthogonal transformation"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "orthogonal transformation,Wronskians",
                    "source": "orthogonal transformation",
                    "target": "Wronskians"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Wronskians,Muir",
                    "source": "Wronskians",
                    "target": "Muir"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Muir,Christoffel",
                    "source": "Muir",
                    "target": "Christoffel"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Christoffel,Frobenius",
                    "source": "Christoffel",
                    "target": "Frobenius"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Frobenius,Hessians",
                    "source": "Frobenius",
                    "target": "Hessians"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Hessians,Trudi",
                    "source": "Hessians",
                    "target": "Trudi"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Trudi,plane",
                    "source": "Trudi",
                    "target": "plane"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "plane,spanned",
                    "source": "plane",
                    "target": "spanned"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "spanned,differential equations",
                    "source": "spanned",
                    "target": "differential equations"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "differential equations,Wronskian",
                    "source": "differential equations",
                    "target": "Wronskian"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Wronskian,analytic functions",
                    "source": "Wronskian",
                    "target": "analytic functions"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "analytic functions,the Wronskian and linear independence",
                    "source": "analytic functions",
                    "target": "the Wronskian and linear independence"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "the Wronskian and linear independence,sequence",
                    "source": "the Wronskian and linear independence",
                    "target": "sequence"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "sequence,orthogonal matrix",
                    "source": "sequence",
                    "target": "orthogonal matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "orthogonal matrix,orthonormal basis",
                    "source": "orthogonal matrix",
                    "target": "orthonormal basis"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "orthonormal basis,Euclidean space",
                    "source": "orthonormal basis",
                    "target": "Euclidean space"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Euclidean space,orientation",
                    "source": "Euclidean space",
                    "target": "orientation"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "orientation,standard basis",
                    "source": "orientation",
                    "target": "standard basis"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "standard basis,linear transformation",
                    "source": "standard basis",
                    "target": "linear transformation"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "linear transformation,rotation",
                    "source": "linear transformation",
                    "target": "rotation"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "rotation,absolute value",
                    "source": "rotation",
                    "target": "absolute value"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "absolute value,parallelepiped",
                    "source": "absolute value",
                    "target": "parallelepiped"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "parallelepiped,measurable",
                    "source": "parallelepiped",
                    "target": "measurable"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "measurable,subset",
                    "source": "measurable",
                    "target": "subset"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "subset,dimensional",
                    "source": "subset",
                    "target": "dimensional"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "dimensional,tetrahedron",
                    "source": "dimensional",
                    "target": "tetrahedron"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "tetrahedron,skew lines",
                    "source": "tetrahedron",
                    "target": "skew lines"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "skew lines,spanning tree",
                    "source": "skew lines",
                    "target": "spanning tree"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "spanning tree,differentiable function",
                    "source": "spanning tree",
                    "target": "differentiable function"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "differentiable function,Jacobian matrix",
                    "source": "differentiable function",
                    "target": "Jacobian matrix"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobian matrix,Jacobian determinant",
                    "source": "Jacobian matrix",
                    "target": "Jacobian determinant"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "Jacobian determinant,integration by substitution",
                    "source": "Jacobian determinant",
                    "target": "integration by substitution"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "integration by substitution,open subset",
                    "source": "integration by substitution",
                    "target": "open subset"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }, {
                "data": {
                    "id": "open subset,inverse function theorem",
                    "source": "open subset",
                    "target": "inverse function theorem"
                },
                "position": {},
                "group": "edges",
                "removed": false,
                "selected": false,
                "selectable": true,
                "locked": false,
                "grabbable": true,
                "classes": ""
            }]
        },
        "style": [{
            "selector": "node",
            "style": {
                "label": "data(id)",
                "background-color": "#666",
                "background-fit": "cover"
            }
        }, {
            "selector": "edge",
            "style": {
                "width": "3px",
                "line-color": "#ccc",
                "target-arrow-shape": "triangle",
                "target-arrow-color": "#ccc"
            }
        }, {
            "selector": ".confused",
            "style": {
                "background-image": "http://www.emoji-cheat-sheet.com/graphics/emojis/confused.png"
            }
        }, {
            "selector": ".satisfied",
            "style": {
                "background-image": "http://www.emoji-cheat-sheet.com/graphics/emojis/satisfied.png"
            }
        }],
        "zoomingEnabled": true,
        "userZoomingEnabled": true,
        "zoom": 1,
        "minZoom": 1e-50,
        "maxZoom": 1e+50,
        "panningEnabled": true,
        "userPanningEnabled": true,
        "pan": {
            "x": 635.5315025535905,
            "y": 9248.488567136874
        },
        "boxSelectionEnabled": true,
        "renderer": {
            "name": "canvas"
        }
    };
    
     response.elements.nodes = response.elements.nodes.splice(0, 10);
                res.json(response);*/


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
});

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
