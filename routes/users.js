var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
var userHelper = require('../helpers/user-helpers');

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user;
  console.log('fffffffffffffffffffffff',user);
  productHelper.getAllProducts().then((products) => {
    console.log(products);
    res.render('user/view-products', { admin: false, products, user });
  })
    
    // res.render('index', { products, admin: false });
  });

router.get('/login', (req, res) => {
  res.render('user/login');
})

router.get('/signup', (req, res) => {
  res.render('user/signup');
})

router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    console.log(response);
    if(response) {
      res.redirect('/login');
    } else {
      res.redirect('/signup')
    }
  })
})

router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if(response.status) {
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    } else {
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
