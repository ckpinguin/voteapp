
import path from 'path';
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var cors = require('cors');
var fetchJson = require('../common/backend/Backend');
var renderRoute = require('./renderRoute');
var dd = require('../common/toolbox');

var PORT = process.env.PORT || 8080;

var app = express();
app.use(compression());
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../../../dist')));

// Allow CORS
app.use(cors());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// Static delivery (bundle to client)
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/dist/index.html');
});

router.get('/votes', function(req, res) {
    console.log('Got a GET request for /votes');
    console.info('from: ' + req.ip + ', for ' + req.hostname);
    fetchJson('/api/votes').then(allVotes => {
        renderRoute(req, res, {allVotes});
    });
});

router.get('/votes/:voteId', function(req, res) {
    console.log('Got a GET request for /votes/' + voteId);
    console.info('from: ' + req.ip + ', for ' + req.hostname);
    const voteId = req.params.voteId;
    fetchJson(`/api/votes/${voteId}`)
        .then(vote => {
            renderRoute(req, res, {vote});
        });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /
app.use('/', router);

app.listen(PORT, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
    }
});
