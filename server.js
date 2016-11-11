var http = require('http');
var express = require('express');
var path = require('path');

var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

var darkTheme = false;

//Session speichern

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
app.use(require("method-override")(methodOverride));
app.use(myDummyLogger());
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(notFound);
app.use(errorHandler);



function showIndex(req, res) {
    if(req.query.switchTheme) darkTheme = !darkTheme;
    res.sendFile(path.join(__dirname + '/public/overview/index.html'));
    //load content from db
}

function showEditform(req, res) {
    res.sendFile(path.join(__dirname + '/public/editItem/index.html'));
}

function showDarkCSS(req, res) {
    if(darkTheme) {
        res.sendFile(path.join(__dirname + '/public/css/dark.css'));
    } else {
        res.send("");
    }
}

function saveNote(req, res) {
    //Check content in the fields with checkContent
    //save content in database
    showIndex(req, res);
}

function editNote(req, res) {
    //id from URL
    //load content from db with id
    //content fill in form
    showEditform(req, res);
}

function getData() {
    var data = {
        "notes": [
      {
          "title":"Geburi 1",
          "desc":"geburtstagsfest",
          "importance":"1",
          "due":"in 5 hours",
          "finished":false
      },
      {
          "title":"Geburi 2",
          "desc":"geburtstagsfestfest",
          "importance":"5",
          "due":"in 10 hours",
          "finished":true
      },
      {
          "title":"Geburi 3",
          "desc":"geburtstagsfestfestfests",
          "importance":"3",
          "due":"in 8 hours",
          "finished":false
      }
      ]
    };
    return data;
}

router.get("/", showIndex);
router.get("/newNote", showEditform);
router.get("/edit", showEditform);
router.get("/css/dark.css", showDarkCSS);
router.post("/notes*", saveNote);
router.post("/edit*", editNote);

router.get('/api/notes', function (req, res) {
  res.json(getData());
});

const hostname ='localhost';
const port = 3000;
app.listen(port, hostname, () => { console.log(`Server is running at http://${hostname}:${port}/`); });
