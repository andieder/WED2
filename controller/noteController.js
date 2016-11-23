var store = require('../services/noteStore.js');
var path = require('path');


module.exports.initVariables = function (req, res) {
    var sess = req.session;

    sess.isExist = true;
    sess.darkTheme = false;
    sess.orderBy = "";
    sess.orderAsc = true;
    sess.filterFinished = false;
};

module.exports.switchTheme = function (req, res) {
    req.session.darkTheme = !req.session.darkTheme;
    res.redirect("/");
};

module.exports.filterFinished = function (req, res) {
    req.session.filterFinished = !req.session.filterFinished;
    res.redirect("/");
};

module.exports.showIndex = function(req, res) {
    var sess = req.session;

    if (typeof req.query.orderBy != 'undefined') {
        if(sess.orderBy == req.query.orderBy) {
            if(sess.orderAsc) {
                sess.orderAsc = false;
            } else {
                sess.orderBy = "";
                sess.orderAsc = true;
            }
        } else {
            sess.orderBy = req.query.orderBy;
                sess.orderAsc = true;
        }
    }
    getData(req, function(content){
        res.render("index.hbs", {   notes : content,
                                    orderByFinishDate : sess.orderByFinishDate,
                                    orderByCreatedDate : sess.orderByCreatedDate,
                                    orderByImportance : sess.orderByImportance,
                                    filterFinished : sess.filterFinished,
                                    orderAsc : sess.orderAsc});
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
    if(req.session.darkTheme) {
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
    var state = req.body.done ? true : false;
    store.edit(req.params.id, req.body.title, req.body.desc, req.body.priority, req.body.dueTo, state, function (err, note) {
        res.redirect("/");
    });
};

function sortByKey(array, key, orderAsc) {
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

function getData(req, callback) {

    var sess = req.session;

    sess.orderByFinishDate = false;
    sess.orderByCreatedDate = false;
    sess.orderByImportance = false;

    var orderAsc = sess.orderAsc;

    var sort = function (err, allNotes) {
        switch(sess.orderBy) {
            case 'finishDate':
                sess.orderByFinishDate = true;
                sortByKey(allNotes, "dueTo", orderAsc);
                break;
            case 'createdDate':
                sess.orderByCreatedDate = true;
                sortByKey(allNotes, "createDate", orderAsc);
                break;
            case 'importance':
                sess.orderByImportance = true;
                sortByKey(allNotes, "priority", orderAsc);
                break;
            default:
        }
        callback(allNotes);
    };

    if(sess.filterFinished) {
        store.getUnfinished(sort);
    } else {
        store.getAll(sort);
    }
}
