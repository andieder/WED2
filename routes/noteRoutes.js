var express = require('express');
var router = express.Router();
var noteslist = require('../controller/noteController.js');

router.get("/", noteslist.showIndex);
router.get("/newNote", noteslist.showEditform);
router.get("/edit", noteslist.showEditform);
router.get("/css/dark.css", noteslist.showDarkCSS);
router.post("/notes*", noteslist.saveNote);
router.post("/edit*", noteslist.editNote);
router.get('/api/notes', noteslist.returnJSON);

module.exports = router;