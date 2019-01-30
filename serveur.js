var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var MongoClient = require('mongodb').MongoClient;

// Database
MongoClient.connect("mongodb+srv://Zbdj:root@cluster0-lfpq5.mongodb.net/test?retryWrites=true", {
  useNewUrlParser: true
}, function (err, db) {
  if (!err) {
    console.log("We are connected");
  }

  if (err) throw err;
  var dbo = db.db("Marsupilami");


  //Inscription du marsupilami
  app.post('/home/create', function (req, res) {

    var pseudo = req.body.username;
    var password = req.body.password;
    var age = req.body.age;
    var famille = req.body.famille;
    var race = req.body.race;
    var nourriture = req.body.nourriture;


    dbo.collection("id").insertOne({
      pseudo,
      password,
      age,
      famille,
      race,
      nourriture
    }, function (err, result) {
      if (err) throw err;

      console.log(result.ops);

      db.close();
    })

    res.redirect('/home');
  });

  //Liste de tout les Marsupilamis

  app.get('/home', function (req, res) {

    dbo.collection("id").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.render('home.ejs', {
        alls: result
      });
    })

  });

  //Afficher le profil d'un marsupilamis

  app.get('/show/:pseudo', function (req, res) {
    var pseudo = req.params.pseudo;
    // console.log(req.params._id)

    dbo.collection("id").find({ pseudo: pseudo}).toArray(function(err, result){
      if (err) throw err;
      // console.log(result)
      res.render('profil.ejs', {
        alls: result
      });
    });
  });


  //Update profil d'un Marsupilami

  app.post('/update/:pseudo', function (req, res){
    var pseudo = req.params.pseudo;
    var new_value = res.body;

    console.log(pseudo);

    dbo.collection("id").updateOne(pseudo, new_value, function(err, res) {
      if (err) throw err;

      console.log("Marsupilami");
      db.close();
    });

  })


  app.get('/delete/:pseudo', function (req, res) {
    var pseudo = { pseudo: req.params.pseudo };
    console.log(pseudo)

    dbo.collection("id").deleteOne(pseudo, function(err, obj) {
      if (err) throw err;
      console.log(req.params.pseudo + " a été supprimer");
    });

    res.redirect('/home');
    // db.close();
  });

















  //Connection
  // app.get('/login', function (req, res) {
  //   res.render('login.ejs', {

  //   });
  // });

  // app.post('/login/submit', function (req, res) {
  //   var pseudo = req.body.username;
  //   var password = req.body.password;

  //   dbo.collection("id").find({
  //       "pseudo": "test",
  //       "password": "123"
  //     }),
  //     function (err, result) {
  //       if (err) {
  //         console.log(err)
  //       } else if (result) {
  //         //user connected
  //         console.log(result);
  //         console.log("result");
  //         db.close();
  //         res.render('login.ejs', {
  //           resultats: result,
  //           forms: res
  //         });
  //       } else {
  //         console.log("marche pas")
  //       }
  //     };
  // });


});



app.get('/register', function (req, res) {

  res.render('register.ejs', {

  });

});

console.log('connection')

app.listen(8080);