var http = require('http');
var hbs = require('express-hbs');
var express = require('express');
var path = require('path');
var session = require('express-session')
var cookieParser = require('cookie-parser')

var bodyParser = require('body-parser');

var app = express();

hbs.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

hbs.registerHelper('dueInDays', function(n, block) {
    var diffDays = "";
    if(n != "") {
        var today = new Date();
        var due = new Date(n);

        var timeDiff = due.getTime() - today.getTime();
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        if(diffDays < 0) {
            diffDays = "overdue";
        } else if (diffDays == 0) {
            diffDays = "today";
        } else {
            diffDays = "in " + diffDays + " day(s)";
        }
    }
    return diffDays;
});

app.engine('hbs', hbs.express4());
app.set('view engine', 'hbs');


function methodOverride(req, res) {
    if(req.body && typeof req.body == 'object' && '_method' in req.body){
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}

function notFound(req, res, next) {
   res.setHeader("Content-Type", 'text/html');
   res.send(404, "Sorry, we could not found your page!" )
}

function errorHandler(err, req, res, next) {
   res.status(500).end(err.message);
}

function myDummyLogger(options) {
   options = options ? options : {};

   return function myInnerDummyLogger(req, res, next) {
       console.log(req.method +":"+ req.url);
       next();
   }
}

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret:"akwmntilxigmapenqwkmtmznbfyautz", resave: false, saveUninitialized: false}));
app.use(require("method-override")(methodOverride));
app.use(myDummyLogger());
app.use(require('./routes/noteRoutes.js'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(notFound);
app.use(errorHandler);

const hostname ='localhost';
const port = 3000;
app.listen(port, hostname, () => { console.log(`Server is running at http://${hostname}:${port}/`); });
