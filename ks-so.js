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

function getQuestions(subject) {
    filter.subject = subject;
    return new Promise(function(resolve, reject) { context.questions.questions(filter,function(error,success) {
          if (error) console.log(error);
            resolve(success);
        }); 
    }).then(function(response) {
        console.log("RESPONSE LENGTH: "+ response.items.length);
        return response.items;
    });
}

exports = module.exports = { getQuestions };

/*
context.questions.questions(filter, function(err, results){
  if (err) throw err;

  console.log(results.items);
});
*/


