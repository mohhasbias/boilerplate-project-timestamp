// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

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

app.get("/api/whoami", function (req, res) {
  return res.json({
    ipaddress: '',
    language: "",
    software: ""
  })
});

// listen for requests :)
// var listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });

module.exports = app;
