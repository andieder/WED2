var http = require('http');
var express = require('express');
var path = require('path');

var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

var store = require('./services/noteStore');

var darkTheme = false;
var orderBy = "";
var orderAsc = true;
var filterFinished = false;

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
    if(req.query.switchFilter) filterFinished = !filterFinished;
    if (typeof req.query.orderBy != 'undefined') {
	    if(orderBy == req.query.orderBy) {
	    	if(orderAsc) {
	    		orderAsc = false;
	    	} else {
	    		orderBy = "";
	    		orderAsc = true;
	    	}
	    } else {
	    	orderBy = req.query.orderBy;
	    }
    }

   res.sendFile(path.join(__dirname + '/public/overview/index.html'));
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
    var state = req.body.done ? true : false;
    store.add(req.body.title, req.body.desc, req.body.priority, req.body.dueTo, state, function (err, doc) {
        showIndex(req, res);
    });
}

function editNote(req, res) {
    //id from URL
    //load content from db with id
    //content fill in form
    showEditform(req, res);
}

function getData() {

	//ToDo: Implement order function
    switch(orderBy) {
	    case 'finishDate':
	        break;
	    case 'createdDate':
	        break;
	    case 'importance':
	        break;
	    default:	        
	}

	//sort out finished items if filterFinished
	console.log("1");
    console.log(filterFinished);

	
    //load content from db
    console.log("2");

    //var allNotes;
    var listNotes = console.log(store.getAll(function (err, content) {
        console.log(content);
        //allNotes = content;
    }));

    console.log("3");
    console.log(listNotes);

	//dummy data
    var data = {
    	"orderByFinishDate": false,
    	"orderByCreatedDate": true,
    	"orderByImportance": false,
    	"orderAsc": true,
    	"filterFinished": false,
        "notes": [
      {
          "title":"Geburi 1",
          "description":"geburtstagsfest",
          "priority":"1",
          "dueTo":"in 5 hours",
          "state":false
      },
      {
          "title":"Geburi 2",
          "description":"geburtstagsfestfest",
          "priority":"5",
          "dueTo":"in 10 hours",
          "state":true
      },
      {
          "title":"Geburi 3",
          "description":"geburtstagsfestfestfests",
          "priority":"10",
          "dueTo":"",
          "state":false
      }
    ]
    };
    store.getAll(function (err, allNotes) {
        data.notes = allNotes;
        console.log(data.notes);
    });
    console.log(data);
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
