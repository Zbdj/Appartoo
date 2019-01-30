var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require('mongodb').MongoClient;

// Database
MongoClient.connect("mongodb+srv://Zbdj:root@cluster0-lfpq5.mongodb.net/test?retryWrites=true",{ useNewUrlParser: true }, function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});



app.get('/home', function (req,res){

    res.writeHead(200);

    res.end('Nice');
  
});

console.log('connection')

app.listen(8080);