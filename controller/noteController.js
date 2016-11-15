var store = require('../services/noteStore.js');
var path = require('path');

var darkTheme = false;
var orderBy = "";
var orderAsc = true;
var filterFinished = false;


module.exports.showIndex = function(req, res) {
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
    getData(function(content){
        res.render("index.hbs", content);
    });
};

module.exports.showEditform = function(req, res) {
   if(req.params.id){
       store.get(req.params.id, function (err, note) {
           res.render("newNote.hbs", note)
       });
    } else {
       res.render("newNote.hbs");
    }
};

module.exports.showDarkCSS = function(req, res) {
    if(darkTheme) {
        res.sendFile(path.join(__dirname + '/../public/css/dark.css'));
    } else {
        res.send("");
    }
};

module.exports.saveNote = function(req, res) {
    var state = req.body.done ? true : false;
    store.add(req.body.title, req.body.desc, req.body.priority, req.body.dueTo, state, function (err, doc) {
        res.redirect("/");
    });
};

module.exports.updateNote = function(req, res) {
    console.log(req.params.id);
    store.edit(req.params.id, req.body.title, req.body.desc, req.body.priority, req.body.dueTo, req.body.done, function (err, note) {
        res.redirect("/");

    });
};


function getData(callback) {

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
    console.log(filterFinished);


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

    //load content from db

    store.getAll(function (err, allNotes) {
        data.notes = allNotes;
        callback(data);
    });

}
