var mysql = require('mysql');

/** Create a mysql connection */
var connection = mysql.createConnection({
  host: "localhost",
  user: "vaibhav",
  password: "password",
  database: "testing_express_jwt"
});

var email = 'vaibhav@aeologic.com';
var password = 'admin@1234';

connection.connect();

connection.query("SELECT * FROM users where email = '"+email+"' and password = '"+password+"'", function (err, rows, fields) {
  if (err) throw err

  console.log('The user list is: ', rows)
});

connection.end();