const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('index', {
    currentUser
  });
});

router.use((req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/')
  } else { // |
    next(); // |
  } // | 
}) // |
//------------------------------------
router.get('/main', (req, res, next) => {
  const currentUser = req.session.currentUser
  res.render('protected/main', {
    currentUser
  })
})

router.get('/private', (req, res, next) => {
  const currentUser = req.session.currentUser
  res.render('protected/private', {
    currentUser
  })
})

module.exports = router;
