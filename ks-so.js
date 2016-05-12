var stackexchange = require('stackexchange');

var options = { version: 2.2 };
var context = new stackexchange(options);

var filter = {
  key: '1rg*ObbWiq8jHElVlOaR2A((',
  pagesize: 10,
  tagged: 'linear-algebra',
  sort: 'activity',
  order: 'asc',
  filter:'!2.u)4sjJ6K-ZBBkHcYUPe'
};


//!bB.KRGASCL.5mP -- no answers
// 
// Get all the questions (http://api.stackexchange.com/docs/questions)

function getResponse(response) {
    console.log("RESPONSE L: "+ response.items.length);
    console.log(response.items[0].answer_count);
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

exports = module.exports = { getQuestions };

/*
context.questions.questions(filter, function(err, results){
  if (err) throw err;

  console.log(results.items);
});
*/


