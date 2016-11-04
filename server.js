var express = require('express');
//var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

//Session speichern
//Use Method-override für normalen Seiten aufruf mit req, res und err;


const hostname ='localhost';
const port = 3000;
app.listen(port, hostname, () => { console.log(`Server is running at http://${hostname}:${port}`); });

