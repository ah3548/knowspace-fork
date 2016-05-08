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

function getAllQuestions(subject) {
    return SOqs.findAll({
        where: {
            tags: {
                $like: '%' + subject.replace(/[ _]/i,'-') + '%'
            }
        }
    }).then(
        function(questions) {
          if (questions!=undefined)  {
              return questions;
          }                    
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

function insertQuestion(entry) {
    return SOqs.create(entry).then(function(question) {
        return question;
    }).catch(function(error) {
        console.log("Error inserting record in database" + error);
    });
}

module.exports = {
    createWikiEntry,
    getWikiEntry,
    insertQuestion,
    getQuestion,
    getAllQuestions
}