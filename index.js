var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var expressValidator  = require('express-validator');

const saltRound = 10;

/** Create a mysql connection */
var con = mysql.createConnection({
  host: "localhost",
  user: "vaibhav",
  password: "password",
  database: "testing_express_jwt"
});

con.connect();

const app = express();


// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 


app.use(expressValidator());


app.get('/api',function(req,res){
    res.json({
        text:'my-api'
    });
});

app.get('/api/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, 'secret_key_goes_here', function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        res.json({
          description: 'Protected information. Congrats!'
        });
      }
    });
  });
  
  function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  }

  app.post('/api/register', (req,res)=>{
    var request_variables = req.body; 
    
    // username must be an email
    req.check('email','email is invalid').isEmail();
    // password must be at least 5 chars long password and confirm password must match
    req.check('password',"must be more than 5 characters and match the confirm password").isLength({ min: 5 }).equals(request_variables.confirm_password);

    // Finds the validation errors in this request and wraps them in an object with handy functions
    var errors = req.validationErrors();
    if(errors){
      res.send(errors);
    }
    else{
      var email = request_variables.email;
      var password = request_variables.password;

    // bcrypt.genSalt(saltRound,function(err,salt){
      // if(err) throw err;
      // bcrypt.hash(password, saltRound, function(err, hash) {

        let hash = bcrypt.hashSync(password, saltRound);

        // Store hash in your password DB.
        var sql = "INSERT INTO users (email, password,is_active) VALUES ('"+email+"', '"+hash+"', '0')";
        con.query(sql, function (err, result) {
          // if (err) throw err;
          if(err){
            res.send("Something went wrong");
          }
          console.log(result.insertId);
          if(result.insertId){
            res.send("1 record inserted insert Id: "+result.insertId);
          }
          else{          
            res.send("Something went wrong");
          }
        });
      // });
    // });
      // res.send(sql);
    }

    // if (errors) {
    //   return res.status(422).json({ errors: errors.array() });
    // }
    
    

  });


app.post('/api/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    // res.send(req.body);
    // insert code here to actually authenticate, or fake it
    // const user = { id: 3 };
    
    // var hash = bcrypt.hashSync(password, saltRound);
    // res.send(hash);
    // bcrypt.compareSync(password, hash);

    // bcrypt.compare(password, hash, function(err, res) {
    //   res.send(res); 
    //   // res == true
    // });

    // res.send(con);
    con.query("SELECT * FROM users where email = '"+email+"' and  is_active='1' LIMIT 1", function (err, rows, fields) {
      if (err) throw err
    
      if(rows.length){
        // then return a token, secret key should be an env variable
        
        if(bcrypt.compareSync(password, rows[0].password)) {
          // res.send('password match');
          const token = jwt.sign({ user: rows[0].id }, 'secret_key_goes_here');
          res.json({
            message: 'Authenticated! Use this token in the "Authorization" header',
            token: token
          });
        } else {
          // Passwords don't match
          res.send('password dont match');
         }

      }
      else{
        res.send("user does not exist or is not active");
      }


    });


    // res.send("email is :"+request_variables.email+" and password is : "+request_variables.password);
    // res.send("recieved your request!");



  });


app.listen(3000,function(){
    console.log('App listening on port 3000');
});

// con.end();