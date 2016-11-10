var Datastore = require('nedb');
var db = new Datastore({filename: './data/notes.db', autoload: true});

function Note(title, description, priority, dueTo, state) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueTo = dueTo;
    this.state = state;
}

function addNote(title, description, priority, dueTo, state, callback) {
    var note = new Note(title, description, priority, dueTo, state);
    db.insert(note, function (err, newDoc) {
        if(callback){
            callback(err, newDoc);
        }
    });
}