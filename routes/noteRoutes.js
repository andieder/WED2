var express = require('express');
var router = express.Router();
var noteslist = require('../controller/noteController.js');

router.get("/", function (req, res) {
    if(typeof req.session.isExist == 'undefined'){
        noteslist.initVariables(req, res)
    }
    noteslist.showIndex(req, res);
});
router.get("/switchTheme", noteslist.switchTheme);
router.get("/filterFinished", noteslist.filterFinished);
router.get("/newNote", noteslist.showEditform);
router.get("/css/dark.css", noteslist.showDarkCSS);
router.post("/notes", noteslist.saveNote);
router.post("/notes/edit/:id", noteslist.updateNote);
router.get("/edit/:id/", noteslist.showEditform);

module.exports = router;