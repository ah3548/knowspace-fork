/*var sequelize = new Sequelize('ks', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});*/
var Sequelize = require('sequelize');

var sequelize = new Sequelize('mysql://root:root@localhost:3306/ks', {logging:false});

var Wiki = sequelize.import("./models/wikipedia");
var SOqs = sequelize.import("./models/so_questions");
var SOas = sequelize.import("./models/so_answers");


function createWikiEntry(entry) {
    return Wiki.create(entry).then(function(wiki) {
        return wiki;
    }).catch(function(error) {
        console.log("Error inserting record in database" + error);
    });
}

function SubjectNotAvailable(subject) {
    this.message = "Wikipedia Entry not found, fetching now..";
    this.subject = subject;
}

function getWikiEntry(subject) {
    return Wiki.findAll({
      where: {
        subject: subject
      }
    }).then(function(wiki) {
        if (wiki != undefined && wiki[0] != undefined) {
            return wiki[0].dataValues.content.toString('utf-8') ;

        }
        else {
            throw new SubjectNotAvailable(subject);
        }
    });
}

function getAllQuestions(subject, number) {
    if (number == null) {
        number = 5;
    }
    SOqs.hasMany(SOas, {
      foreignKey: 'question_id',
      constraints: false
    });
    return SOqs.findAll({
        include: [{
            model: SOas,
            where: { question_id: Sequelize.col('so_answers.question_id') }
        }],
        limit: number,
        where: {
            tags: {
                $like: '%' + subject.replace(/[ _]/i,'-') + '%'
            }
        }
    }).then(
        function(questions) {
          if (questions!=undefined)  {
              convertBlobsToString(questions);
              return questions;
          }                    
        });
}

function toUTF8(entry) {
    return entry.dataValues.body.toString('utf-8');
}

function convertBlobsToString(listOfEntries) {
    listOfEntries.forEach(
        function(question) {
            question.dataValues.body = toUTF8(question); 
        question.so_answers.forEach(
            function(answer) {
                answer.dataValues.body = toUTF8(answer);
            });
        });
}

function getQuestion(question_id) {
    return SOqs.findAll({
        where: {
        question_id: question_id
      }
    }).then(function(question) {
        if (question != undefined && question[0] != undefined) {
            return question[0].dataValues.body.toString('utf-8');
        }
        else {
            throw new Error("Question " + question_id + " doesnt exist in the database, inserting now..");
        }
    });
}

function getAnswer(answer_id) {
    return SOas.findAll({
        where: {
        answer_id: answer_id
      }
    }).then(function(answer) {
        if (answer != undefined && answer[0] != undefined) {
            return answer[0].dataValues.body.toString('utf-8');
        }
        else {
            throw new Error("Answer " + answer_id + " doesnt exist in the database, inserting now..");
        }
    });
}

function insertQuestion(entry) {
    return SOqs.create(entry).then(function(question) {
        return question;
    }).catch(function(error) {
        console.log("Error inserting record in database" + error);
    });
}

function insertAnswer(entry) {
    return SOas.create(entry).then(function(answers) {
        return answers;
    }).catch(function(error) {
        console.log("Error inserting record in database" + error);
    });
}
/*
getAllQuestions("linear-algebra").then(
    result => { console.log(result[0].dataValues.so_answers[0].dataValues); }
);*/

module.exports = {
    createWikiEntry,
    getWikiEntry,
    insertQuestion,
    getQuestion,
    getAllQuestions,
    getAnswer,
    insertAnswer
}