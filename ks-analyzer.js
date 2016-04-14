var stackexchange = require('stackexchange');

var options = { version: 2.2 };
var context = new stackexchange(options);

var filter = {
  key: '1rg*ObbWiq8jHElVlOaR2A((',
  pagesize: 50,
  tagged: 'linear-algebra',
  sort: 'activity',
  order: 'asc'
};

// Get all the questions (http://api.stackexchange.com/docs/questions)
context.questions.questions(filter, function(err, results){
  if (err) throw err;

  console.log(results.items);
  console.log(results.has_more);
});



