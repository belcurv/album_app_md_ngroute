/*
 * server.js 
*/

// SET UP =====================================================================
var express  = require('express'),
    app      = express(),
    mongoose = require('mongoose'),
    morgan   = require('morgan'),
    _        = require('underscore'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    db       = require('./config/db'),
    port     = process.env.PORT || 3000;            // set listener port


// CONFIGURATION ==============================================================

mongoose.connect(db.url);                           // connect to database

app.use(express.static(__dirname + '/public'));     // set static files locatn
app.use(morgan('dev'));                             // log every rqst to consle
app.use(bodyParser.urlencoded({ 'extended' : 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());


// ROUTES =====================================================================
require('./app/routes')(app);


// START APP ==================================================================
app.listen(port);
console.log('Server running on port ' + port);