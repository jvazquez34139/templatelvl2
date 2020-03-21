const express = require('express');
let router = express.Router();
const dbcon = require('../dbcon.js');


//get all users onto the front-end for the jquery to reorganize
router.get('/admin', (req, res, next) => {
  const db = dbcon.opendb();
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    //admin access only confirmation
    console.log(req.cookies.user)
    if(req.cookies.user){
      const adminCheck = User.find({username: req.cookies.user.username}, function
      (err, user){
        if(err) {
          res.redirect('/RestrictedAccess')
          return handleError(err);
        }else{
          if(user[0].admin){
            const query = User.find({}, function
              (err, users){
                if(err) return handleError(err);
                res.render("admin", {userArray: users});
              });
          }
          else{
            res.redirect('/RestrictedAccess')
          }
        }
      });
    }else{
      res.redirect('/RestrictedAccess')
    }
  });
});

//for unexpected intruders
router.get('/RestrictedAccess', (req, res, next) => {
  res.render('rao');
});


router.get('/delete:id', (req, res, next) => {
  const db = dbcon.opendb();
  const {username} = req.cookies.user;
  const {id} = req.params;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    const query = User.deleteOne({_id: id}, function
    (err, User){
      if(err) return handleError(err);
      res.redirect("/admin");
    })
  });
});

module.exports = router;
