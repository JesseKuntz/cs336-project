/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var assert = require('assert');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var db;
var APP_PATH = path.join(__dirname, 'dist');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(APP_PATH));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

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
  db.collection('messages').find().toArray(function (err, result) {
    assert.equal(null, err);

    res.json(result);
  });
});

app.post('/api/messages', function(req, res) {
  db.collection('messages').insertOne(
    {
      timestamp: Date.now(),
      author: req.body.author,
      text: req.body.text,
      file_type: req.body.fileType,
      data: req.body.data
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

//

// maybe not necessary
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

MongoClient.connect('mongodb://awesomeuser:' + process.env.MONGO_PASSWORD + '@ds117540.mlab.com:17540/filechat', function (err, client) {
  if (err) throw err

  db = client;

  app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
  });

  db.collection('messages').find().toArray(function (err, result) {
    if (err) throw err

    console.log(result)
  })
});