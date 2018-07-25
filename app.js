var express = require('express');
var app = express();
var path = require('path');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session');

var router = express.Router();

// views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// page engine
app.engine('html', hbs.__express);

// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    cookie : 1000 * 60 * 30
}));

require('./routes')(router, io);

router.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/login.html');
});

app.use('/', router);

server.listen(3000);
