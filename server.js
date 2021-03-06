var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var assert = require('assert');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var db;
var APP_PATH = path.join(__dirname, 'dist');
var DOWNLOAD_PATH = path.join(__dirname, 'download');
var fs = require('fs');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(APP_PATH));
app.use('/download', express.static(DOWNLOAD_PATH));

app.use(bodyParser.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({limit: '16mb', extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest messages.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/messages', function(req, res) {
  db.collection('messages').find().sort({timestamp: 1}).toArray(function (err, result) {
    assert.equal(null, err);

    res.json(result);
  });
});

app.post('/api/messages', function(req, res) {
  let time = Date.now();
  db.collection('messages').insertOne(
    {
      timestamp: time,
      author: req.body.author,
      text: req.body.text,
      file_type: req.body.fileType
    },
    function(err, r) {
      assert.equal(null, err);
    }
  );

  db.collection('data').insertOne(
    {
      timestamp: time,
      data: req.body.data,
      file_type: req.body.fileType
    },
    function(err, r) {
      assert.equal(null, err);
    }
  );
});

app.get('/api/messages/:timestamp', function(req, res) {
  db.collection("messages").find({"timestamp": Number(req.params.timestamp)}).toArray(function(err, docs) {
      if (err) throw err;
      res.json(docs);
  });
});

app.get('/api/messages/:timestamp/data', function(req, res) {
  // Make the download folder if it doesn't already exist
  if (!fs.existsSync('download')){
    fs.mkdirSync('download');
  }

  // Clear out the download folder
  fs.readdir('download', (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join('download', file), err => {
        if (err) throw err;
      });
    }
  });

  db.collection("data").findOne({"timestamp": Number(req.params.timestamp)})
  .then(function(result) {
    let filename = 'download/' + result.timestamp + '.' + result.file_type;
    let base64Image = result.data.split(';base64,').pop();
    fs.writeFile(filename, base64Image, {encoding: 'base64'}, function(err) {
    });
    res.redirect("/" + filename);
  })
});

// Used through CURL
app.put('/api/messages/:timestamp', function(req, res) {
  var updateId = Number(req.params.timestamp);
  var update = req.body;
  db.collection('messages').updateOne(
      { timestamp: updateId },
      { $set: update },
      function(err, result) {
          if (err) throw err;
          db.collection("messages").find({}).toArray(function(err, docs) {
              if (err) throw err;
              res.json(docs);
          });
      });
});

// Used through CURL
app.delete('/api/messages/:timestamp', function(req, res) {
  db.collection("messages").deleteOne(
      {'timestamp': Number(req.params.timestamp)},
      function(err, result) {
          if (err) throw err;
          db.collection("messages").find({}).toArray(function(err, docs) {
              if (err) throw err;
              res.json(docs);
          });
      });
});

app.use('*', express.static(APP_PATH));

let MONGO_PASSWORD = "webdevRocks2"

MongoClient.connect('mongodb://awesomeuser:' + MONGO_PASSWORD + '@ds117540.mlab.com:17540/filechat', function (err, client) {
  if (err) throw err

  db = client;

  app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
  });

  db.collection('messages').find().toArray(function (err, result) {
    if (err) throw err
  });
});