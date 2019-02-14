'use strict';
const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const flash     = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const configDB = require('./config/database.js');
const configAuth = require('./config/auth');
const app = express();
const mongoose = require('mongoose');
require('./config/passport')(passport); // pass passport for configuration
const routes = require('./routes');

mongoose.Promise = require('bluebird');
mongoose.connect( configDB.mongo[process.env.NODE_ENV].connectionString, 
  { useMongoClient: true, promiseLibrary: require('bluebird') } )
  .then(() =>  debug('DB connected succesfully'))
  .catch((dbErr) => {
    throw dbErr;
  });

mongoose.set('debug', process.env.NODE_ENV === 'development' ? true : false);
  
debug("Welcome to xBook RestAPI logger");

app.use(morgan('dev'));     //should be removed in production
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());   //transition req.body from json to Object
app.use(bodyParser.urlencoded({'extended':'false'}));  //transition req.body from x-www-form-urlencoded to Object
app.use(express.static(path.join(__dirname, 'public')));              

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', `*`);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

// required for passport
app.use(session({    
  secret: configAuth.sessionSecret,
  resave: false,
  saveUninitialized: false})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use('/api', routes);

// catch 404 -can't find resource , and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//////////ERROR HANDLING
//remember: 4xx - there's an error in the request itself
//400 -error in the requset itself
//404 not found
//5xx - there's an error in the processing of the response
//500- server's fault
app.use((err, req, res, next) => {
  /////mongoose invalid ObjectId
  if(err.name == 'CastError') {
    err.status = 400;
  }
  /////mongoose validation error
  if(err.name == 'ValidationError') {
    err.status = 400;
    //could check what field failed validation
    let fieldErrors = '';
    for(field of err.errors) {
      debug(err.errors[field].message);
      fieldErrors += err.errors[field].message + '; ';
    }
    err.message = fieldErrors;    //maybe not should be display for the user
  }

  

  res.status(err.status || 500);
  debug(err);
  res.json(err);    //Error class is the father class of all erros, and it has {name , message}
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Express server listening on port ${process.env.NODE_ENV}`);
});
