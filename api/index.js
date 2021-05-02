// server.js
// where your node app starts

var dns = require('dns');
var { URL } = require('url');
var validator = require('validator');

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// body parseu
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
// app.get("/api", function (req, res) {
//   res.sendFile(__dirname + '/views/index.html');
// });


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// url shortener
const lookupTable = []

app.post('/api/shorturl', function(req, res, next) {
  if(!validator.isURL(req.body.url)) {
    return res.json({error: 'invalid url'});
  }
  const url = new URL(req.body.url);
  dns.lookup(url.hostname, (err) => {
    if(err) {
      return res.json({error: 'invalid url'})
    }
    lookupTable.push(req.body.url);
    return res.json({
      original_url: req.body.url,
      short_url: lookupTable.length-1
    });
  });
});

app.get('/api/shorturl/:id', function (req, res) {
  res.redirect(lookupTable[req.params.id])
});

app.get('/api/shorturl', function(req, res) {

});

// parse request header
app.get("/api/whoami", function (req, res) {
  return res.json({
    ipaddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    language: req.acceptsLanguages()[0],
    software: req.headers['user-agent']
  })
});

// timestamp service
app.get("/api/:dateOrTimestamp?", function (req, res) {
  if(!req.params.dateOrTimestamp) {
    return res.json({
      unix: new Date().valueOf(),
      utc: new Date().toUTCString()
    });
  }
  
  const dateOrTimestamp = new Date(req.params.dateOrTimestamp).getTime() > 0
    ? new Date(req.params.dateOrTimestamp)
    : new Date(parseInt(req.params.dateOrTimestamp))

  
  const isValid = dateOrTimestamp.getTime() > 0;

  if(!isValid) {
    return res.json({ error: "Invalid Date"})
  }

  res.json({
    unix: dateOrTimestamp.valueOf(),
    utc: dateOrTimestamp.toUTCString()
  })
});

// listen for requests :)
// var listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });

module.exports = app;
