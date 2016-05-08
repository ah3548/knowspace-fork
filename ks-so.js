var stackexchange = require('stackexchange');

var options = { version: 2.2 };
var context = new stackexchange(options);

var filter = {
  key: '1rg*ObbWiq8jHElVlOaR2A((',
  pagesize: 10,
  tagged: 'linear-algebra',
  sort: 'activity',
  order: 'asc',
  filter:'!bB.KRGASCL.5mP'
};

// Get all the questions (http://api.stackexchange.com/docs/questions)

function getResponse(response) {
    console.log("RESPONSE L: "+ response.items.length);
    return response.items;
}

function getQuestions(subject) {
    filter.tagged = subject;
    return new Promise(function(resolve, reject) { context.questions.questions(filter,function(error,success) {
          if (error) console.log(error);
            resolve(success);
        }); 
    }).then(getResponse);
}

function getAnswers() {
    return new Promise(function(resolve, reject) { context.answers.answers(filter,function(error,success) {
          if (error) console.log(error);
            resolve(success);
        }); 
    }).then(getResponse);
}

getAnswers();

exports = module.exports = { getQuestions };

/*
context.questions.questions(filter, function(err, results){
  if (err) throw err;

  console.log(results.items);
});
*/


