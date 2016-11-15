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
                orderAsc = true;
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

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if(orderAsc) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        } else {
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        }
    });
}

function getData(callback) {

    //default data
    var data = {
        "orderByFinishDate": false,
        "orderByCreatedDate": false,
        "orderByImportance": false,
        "orderAsc": true,
        "filterFinished": false,
        "notes": []
    };

    var sort = function (err, allNotes) {
        switch(orderBy) {
            case 'finishDate':
                data.orderByFinishDate = true;
                sortByKey(allNotes, "dueTo");
                break;
            case 'createdDate':
                data.orderByCreatedDate = true;
                sortByKey(allNotes, "createDate");
                break;
            case 'importance':
                data.orderByImportance = true;
                sortByKey(allNotes, "priority");
                break;
            default:
        }

        data.orderAsc = orderAsc;
        data.filterFinished = filterFinished;

        data.notes = allNotes;
        callback(data);
    };

    if(filterFinished) {
        store.getUnfinished(sort);
    } else {
        store.getAll(sort);
    }

}
