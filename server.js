var http = require('http');
var fs = require('fs');
var express = require('express');

var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

//Session speichern
//Use Method-override für normalen Seiten aufruf mit req, res und err;
function methodOverride(req, res) {
    if(req.body && typeof req.body == 'object' && '_method' in req.body){
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
 }

 function notFound(req, res, next) {
     res.setHeader("Content-Type", 'text/html');
     res.send(404, "Sorry, we could not find your page!" )
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
app.use(require("method-override")(methodOverride));
app.use(myDummyLogger());
app.use(router);
app.use(express.static(__dirname + '/public'));
app.use(notFound);
app.use(errorHandler);



function showIndex(req, res) {
    fs.readFile('./public/overview/index.html', function (err, data) {
        if(err) {
            throw err;
        }
        res.set('Content-Type', 'text/html');
        res.send(200, data);
    });
}


router.get("/", showIndex);


const hostname ='localhost';
const port = 3000;
app.listen(port, hostname, () => { console.log(`Server is running at http://${hostname}:${port}/`); });
