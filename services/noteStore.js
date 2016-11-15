var Datastore = require('nedb');
var db = new Datastore({filename: './data/notes.db', autoload: true});

function Note(title, description, priority, dueTo, state) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueTo = dueTo;
    this.state = state;
    this.createDate = JSON.stringify(new Date());
}

function publicAddNote(title, description, priority, dueTo, state, callback) {
    var note = new Note(title, description, priority, dueTo, state);
    db.insert(note, function (err, newDoc) {
        if(callback){
            callback(err, newDoc);
        }
    });
}

function publicUpdateNote(id, title, description, priority, dueTo, state, callback) {
    db.update({_id: id}, {$set: {title: title, description: description, priority: priority, dueTo: dueTo, state: state}}, {}, function (err, doc) {
        publicGet(id, callback);
    });
}

function publicGet(id, callback) {
    db.findOne({_id: id}, function (err, doc) {
         callback(err, doc);
    });
}

function publicGetAll(callback) {
    db.find({}, function (err, doc) {
        callback(err, doc);
    });
}


module.exports = {add : publicAddNote, edit : publicUpdateNote, get : publicGet, getAll : publicGetAll};