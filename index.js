require('dotenv').config();
var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
// var mysql = require('mysql');
var bcrypt = require('bcrypt');
var expressValidator  = require('express-validator');
var nodemailer = require('nodemailer');
var isBase64 = require('is-base64');
var filesystem = require("fs");


var con = require('./includes/db');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD
    }
});

const saltRound = 10;

/** Create a mysql connection */
/*
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

con.connect();
*/


const app = express();


// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 


app.use(expressValidator());





/** This is a protected route here which will require the access token */
app.get('/api/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        res.status(200).send({
          status: 200,
          message: 'Protected information. Congrats!',
          data: data
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

  app.post('/api/forgot-password', (req,res)=>{
    req.check('email','email is invalid').isEmail();
    // Finds the validation errors in this request and wraps them in an object with handy functions
    var errors = req.validationErrors();
    if(errors){
      res.status(400).send({
        status: 400,
        message:errors[0].msg
      });
    }
    else{
        email = req.body.email;
        con.query("SELECT * FROM users where email = ? and  is_active=? LIMIT 1",[email,'1'], function (err, rows, fields) {
          if (err) throw err
        
          if(rows.length){
            // then return a token, secret key should be an env variable
            let new_password = Math.random().toString(36).slice(-8);
            let hash = bcrypt.hashSync(new_password, saltRound);
            let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
            
            var sql = "UPDATE users SET password = '"+hash+"',updated_at = '"+updated_at+"' WHERE id = "+rows[0].id;
          con.query(sql, function (err, result) {
            if (err) {
              res.send('Something went wrong');
            }
            else{
              if(result.affectedRows){
                var mailOptions = {
                  from: process.env.EMAIL,
                  to: 'vaibhav@aeologic.com',
                  subject: 'Password updated for your user',
                  text: 'Password is updated your new password is '+new_password
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    res.status(400).send({
                        status: 400,
                        message:"Something went wrong please try again"
                      });
                  } else {
                      res.status(200).send({
                        status: 200,
                        message: 'A New password has been sent at your mail id'
                      });
                  }
                });
              }
              else{
                res.status(400).send({
                  status: 400,
                  message:"Something went wrong"
                });
              }
            }
          });

            // res.send(randomstring);
          }
          else{
            res.status(400).send({
              status: 400,
              message:"user does not exist or is not active"
            });
          }
        });
      
    }

  });

  app.post('/api/edit-user', ensureToken, (req,res)=>{
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        // var request_variables = req.body; 
        var email = req.body.email;
        var username = req.body.username;
        var userimage = req.body.userimage;

        // username must be an email
        req.check('email','email is invalid').isEmail();
        req.check('username',"must be more than 5 characters").isLength({ min: 5 });

        // Finds the validation errors in this request and wraps them in an object with handy functions
        var errors = req.validationErrors();
        if(errors){
          res.status(400).send({
            status: 400,
            message:errors[0].msg
          });
        }
        else{
          let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

          // Store hash in your password DB.
          if(userimage != undefined && userimage != ""){
            
            if(isBase64(userimage, {mime: true})){
              var image_path = "./public/images/"+data.user+"/";
              if (!filesystem.existsSync(image_path)){
                filesystem.mkdirSync(image_path);
              }

              var image_name = Math.random().toString(36).substr(2, 11) + data.user ;
              var imageExtention = userimage.split(';')[0].split('/')[1];
              var image_full_path =  image_path+image_name+'.'+imageExtention;

              var query = "Update users SET email = ? , image = ?,  username = ?, updated_at = ? where id = ?";
              var paramarray = [email,image_full_path,username,updated_at,data.user];
              var allowed_image_extention = ['png','jpg','jpeg','gif'];
  
              var base64Data = userimage.replace(/^data:image\/png;base64,/, "");

              if(allowed_image_extention.includes(imageExtention)){
                filesystem.writeFile(image_full_path, base64Data, 'base64', function(err) {
                  if(err){
                    res.status(400).send({
                      status: 400,
                      message:"Something went wrong",
                      error:err
                    });
                  }
                });
              }
              else{
                res.status(400).send({
                  status: 400,
                  message:"Image Extention not allowed"
                });
              }
            }
            else{
              res.status(400).send({
                status: 400,
                message:"Wrong base64 Value"
              });
            }

            
          }
          else{
            var query = "Update users SET email = ? ,username = ?, updated_at = ? where id = ?";
            var paramarray = [email,username,updated_at,data.user];
          }
          con.query(query , paramarray, function (err, result) {
            // if (err) throw err;
            if(err){
              res.status(400).send({
                status: 400,
                message:"Something went wrong",
                error:err
              });
            }
            // console.log(result);
            if(result.affectedRows){
              res.status(200).send({
                status: 200,
                message: "record Updated"
              });
            }
            else{          
              res.status(400).send({
                status: 400,
                message:"Something went wrong 2",
                error:err
              });
            }
          });
        }
      }
    });
  }); 


  app.post('/api/register', (req,res)=>{
    var request_variables = req.body; 
    
    // username must be an email
    req.check('email','email is invalid').isEmail();
    // password must be at least 5 chars long password and confirm password must match
    req.check('password',"must be more than 5 characters and match the confirm password").isLength({ min: 5 }).equals(request_variables.confirm_password);
    req.check('username',"must be more than 5 characters").isLength({ min: 5 });

    // Finds the validation errors in this request and wraps them in an object with handy functions
    var errors = req.validationErrors();
    if(errors){
      res.status(400).send({
        status: 400,
        message:errors[0].msg
      });
    }
    else{
      var email = request_variables.email;
      var password = request_variables.password;
      var username = request_variables.username;

    // bcrypt.genSalt(saltRound,function(err,salt){
      // if(err) throw err;
      // bcrypt.hash(password, saltRound, function(err, hash) {

        let hash = bcrypt.hashSync(password, saltRound);
        let created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Store hash in your password DB.
        var sql = "INSERT INTO users (email, username, password,is_active,created_at,updated_at) VALUES ('"+email+"','"+username+"', '"+hash+"', '0','"+created_at+"','"+updated_at+"')";
        con.query(sql, function (err, result) {
          // if (err) throw err;
          if(err){
            res.status(400).send({
              status: 400,
              message:"Something went wrong"
            });
          }
          console.log(result.insertId);
          if(result.insertId){
            res.status(200).send({
              status: 200,
              data: "1 record inserted insert Id: "+result.insertId
            });
          }
          else{          
            res.status(400).send({
              status: 400,
              message:"Something went wrong"
            });
          }
        });
    }
  });


app.post('/api/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    // username must be an email
    req.check('email','email is invalid').isEmail();
    // password must be at least 5 chars long password and confirm password must match
    req.check('password',"must be more than 5 characters and match the confirm password").isLength({ min: 5 });

    // Finds the validation errors in this request and wraps them in an object with handy functions
    var errors = req.validationErrors();
    if(errors){
      res.status(400).send({
        status: 400,
        message:errors[0].msg
      });
    }
    else{
    con.query("SELECT * FROM users where email = '"+email+"' and  is_active='1' LIMIT 1", function (err, rows, fields) {
      if (err) throw err
    
      if(rows.length){
        // then return a token, secret key should be an env variable
        
        if(bcrypt.compareSync(password, rows[0].password)) {
          // res.send('password match');
          const token = jwt.sign({ user: rows[0].id }, process.env.JWT_SECRET_KEY);
          res.status(200).send({
            status: 200,
            message: 'Authenticated! Use this token in the "Authorization" header',
            token: token
          });
        } else {
          // Passwords don't match
          res.status(400).send({
            status: 400,
            message:"password dont match"
          });
         }

      }
      else{
        res.status(400).send({
          status: 400,
          message:"user does not exist or is not active"
        });
      }
    });
  }
    // res.send("email is :"+request_variables.email+" and password is : "+request_variables.password);
    // res.send("recieved your request!");
  });

  app.post('/api/change-password', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var new_password = req.body.new_password;
    // username must be an email
    req.check('email','email is invalid').isEmail();
    // password must be at least 5 chars long password and confirm password must match
    req.check('password',"must be more than 5 characters and match the confirm password").isLength({ min: 5 }).equals(confirm_password);
    req.check('new_password',"New Password must be more than 5 characters").isLength({ min: 5 });
    // Finds the validation errors in this request and wraps them in an object with handy functions
    var errors = req.validationErrors();
    if(errors){
      res.status(400).send({
        status: 400,
        message:errors[0].msg
      });
    }
    else{
    con.query("SELECT * FROM users where email = '"+email+"' and  is_active='1' LIMIT 1", function (err, rows, fields) {
      if (err) {
        res.status(400).send({
          status: 400,
          message:err
        });
      }
    
      if(rows.length){
        // then return a token, secret key should be an env variable
        
        if(bcrypt.compareSync(password, rows[0].password)) {
         
          let hash = bcrypt.hashSync(new_password, saltRound);
          let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
          
          var sql = "UPDATE users SET password = '"+hash+"',updated_at = '"+updated_at+"' WHERE id = "+rows[0].id;
          con.query(sql, function (err, result) {
            if (err) {
              res.send('Something went wrong');
            }
            else{
              if(result.affectedRows){
                res.status(200).send({
                  status: 200,
                  message: 'Password is updated'
                });
              }
              else{
                res.status(400).send({
                  status: 400,
                  message:"Something went wrong"
                });
              }
            }
          });

        } else {
          // Passwords don't match
          res.status(400).send({
            status: 400,
            message:"password dont match"
          });
         }

      }
      else{
        res.status(400).send({
          status: 400,
          message:"user does not exist or is not active"
        });
      }

    });
  }


    // res.send("email is :"+request_variables.email+" and password is : "+request_variables.password);
    // res.send("recieved your request!");



  });


app.listen(3000,function(){
    console.log('App listening on port 3000');
});

// con.end();