let express = require('express');
let path = require('path');
let config = require('./config.json');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let compression = require('compression');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(compression({level: 5}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public/app/dist'))); //ng 2

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/fe-app.ctrl'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        message: err.message,
        error:   {}
    });
});

module.exports = app;
