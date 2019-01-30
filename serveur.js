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

    if (err) throw err;
    var dbo = db.db("Marsupilami");

  
  //Inscription du marsupilami
  app.post('/home/create', function (req,res){

    var pseudo = req.body.username;
    var password = req.body.password;
    var age = req.body.age;
    var famille = req.body.famille;
    var race = req.body.race;
    var nourriture = req.body.nourriture;


    dbo.collection("id").insertOne({pseudo,password,age,famille,race,nourriture}, function(err, result) {
      if (err) throw err;
      
      console.log(result.ops);

      db.close();
      })

      res.redirect('/home');
  });

});

app.get('/home', function (req,res){

    res.render('home.ejs', {

    });  
});

app.get('/register', function (req,res){

  res.render('register.ejs', {

  });

});

console.log('connection')

app.listen(8080);