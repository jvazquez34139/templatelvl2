const express = require('express');
let router = express.Router();
const dbcon = require('../dbcon.js');


///REGISTER
router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  const {username, email, password, confirmPassword} = req.body;
  const db = dbcon.opendb();

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    const query = User.find({username: username}, function
    (err, users){
      const errorsSafe = {message1: "", message2: ""};
      const errors = {message1: "", message2: ""};
      if(err) return handleError(err);

//////////error checks
      if(password != confirmPassword){
        errors.message2 = "Sorry your passwords do not match.";
      }
      if(users.length > 0){
        errors.message1 = "Username already exists.";
      }

//////////route choosing
      if(errors.message1 == "" && errors.message2 == ""){
        console.log("safe");
        const newUser = new User({
          email: email,
          username: username,
          password: password,
          admin: false
        });
        newUser.save((err, newUser) => {
          if(err) return console.error(err);
          console.log("Successfully registered " + newUser);
          res.redirect('/login')
        });
      }else{
          console.log(errors);
          console.log(errorsSafe);
          res.render('register', errors);
        }
    });
  });
});

// ///LOG IN
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  const db = dbcon.opendb();

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    const query = User.find({username: username}, function
      (err, user){
        if(err) return handleError(err);
        if(user.length >= 1){
        if(password == user[0].password){
          res.cookie('user', user[0]);
          console.log(user[0]);
          req.app.locals.user = user[0];
          res.redirect('/');
        }else{
          res.render('login', {message2: "Wrong password. Try again"});
        }
      }else{
        res.render('login', {message1: "That user doesnt exist, please register!"});
      }
    });
  });
});

  router.get('/logout', (req, res, next) => {
    res.clearCookie('user');
    req.app.locals.user = "";

    res.redirect('/login');
  });

  module.exports = router;
