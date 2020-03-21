const express = require('express');
let router = express.Router();

router.get('/sanity', (req, res, next) => {
  res.send('sanity test :)');
})

router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
