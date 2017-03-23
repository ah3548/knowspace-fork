var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'ks'
});

connection.connect();

connection.query('SELECT * FROM test', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].text);
});

connection.end();