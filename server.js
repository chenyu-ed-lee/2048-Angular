var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, './app')));
// require('./config/mongoose.js');
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());
// require('./config/route.js')(app);

var port = process.env.PORT || 8000;
console.log("Listening on " + port);

app.listen(port);