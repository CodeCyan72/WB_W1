/*******************************************************************************
 * Feel free to remove this comment block and all other comments after pulling. 
 * They're for information purposes only.
 * 
 * This layout is provided to you for an easy and quick setup to either pull
 * or use to correct yours after working at least 1 hour on Team Activity 02.
 * Throughout the course, we'll be using Express.js for our view engines.
 * However, feel free to use pug or handlebars ('with extension hbs'). You will
 * need to make sure you install them beforehand according to the reading from
 * Udemy course. 
 * IMPORTANT: Make sure to run "npm install" in your root before "npm start"
 *******************************************************************************/
// Our initial setup (package requires, port number setup)
const express = require('express');
const session = require('express-session')

const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const User = require('./models/user');
const Customer = require('./models/customer');
const app = express();

MONGODB_URI = 'mongodb+srv://Heroku_User:7q0dTVkK80Q2tWjm@cluster0.qceaq.mongodb.net/test';
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// const mongoConnect = require('./util/database').mongoConnect;

app.use((req, res, next) => {
  User.findById('6018b37b62eced21198652e6')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});


// Route setup. You can implement more in the future!
const ta01Routes = require('./routes/ta01');
const ta02Routes = require('./routes/ta02');
const ta03Routes = require('./routes/ta03');
const ta04Routes = require('./routes/ta04');
const prove01Routes = require('./routes/prove01');
const prove02Routes = require('./routes/prove02');
const week05 = require('./routes/w05Class');
const ta = require('./routes/ta');
const authRoutes = require('./routes/auth');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))   // All renders start from the views folder
  .set('view engine', 'ejs')                     // Allows us to ommit .ejs in res.render
  .use(bodyParser.urlencoded({ extended: false })) // For parsing the body of a POST
  .use(session({ secret: "thisIsAPassword", resave: false, saveUninitialized: false, store: store}))
  .use('/ta01', ta01Routes)
  .use('/ta02', ta02Routes)
  .use('/ta03', ta03Routes)
  .use('/ta04', ta04Routes)
  .use('/prove01', prove01Routes)
  .use('/prove02', prove02Routes)
  .use('/admin', adminRoutes)
  .use('/shop', shopRoutes)
  .use('/classActivities/05', week05)
  .use('/ta', ta)
  .use('/auth', authRoutes)
  .get('/', (req, res, next) => {
    // This is the primary index, always handled last. 
    res.render('pages/index', { title: 'Welcome to my CSE341 repo', path: '/' });
  })
  .use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  })
  // .use((req, res, next) => {
  //   Customer.findById('60197b8150f49825e961c531')
  //     .then(customer => {
  //       req.session.customer = customer;
  //       next();
  //     })
  //     .catch(err => console.log(err));
  // })
  .use((req, res, next) => {
    // 404 page
    res.render('pages/404', { title: '404 - Page Not Found', path: req.url })
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


mongoose.connect('mongodb+srv://Heroku_User:7q0dTVkK80Q2tWjm@cluster0.qceaq.mongodb.net/test?retryWrites=true&w=majority')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Paul',
          email: 'paul@shop.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  }).catch(err => {
    console.log(err);
  });