'use strict';
const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const flash     = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');
require('./config/passport')(passport); // pass passport for configuration
const routes = require('./routes');
const cors = require('cors');
const http = require('http')
  , https = require('https');
const fs = require('fs');

mongoose.connect( process.env.MONGO_CON_STR, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() =>  debug('DB connected succesfully'))
  .catch((dbErr) => {
    throw dbErr;
  });

mongoose.set('debug', process.env.ENV === 'development' ? true : false);
  
debug("Welcome to xBook RestAPI logger");

app.use(cors());
app.options('*', cors());
app.use(morgan('dev'));     //should be removed in production
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());   //transition req.body from json to Object
app.use(bodyParser.urlencoded({'extended':'false'}));  //transition req.body from x-www-form-urlencoded to Object
app.use(express.static(path.join(__dirname, 'public')));              

app.use(passport.initialize());
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
    debug(err);
  }

  

  res.status(err.status || 500);
  debug(err);
  res.json(err);    //Error class is the father class of all erros, and it has {name , message}
});

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
}

http.createServer(app).listen(process.env.PORT || 80);
process.env.HTTPS === '1' && https.createServer(httpsOptions, app).listen(443);
