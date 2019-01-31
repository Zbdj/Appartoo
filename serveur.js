var express = require('express');
var app = express();

var localStorage = require('localStorage');


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

      // console.log(result.ops);

      // db.close();
    })

    res.redirect('/home');
  });


  //Liste de tout les Marsupilamis

  app.get('/home', function (req, res) {
    var log = localStorage.getItem('status');

    dbo.collection("id").find({}).toArray(function (err, result) {
      if (err) throw err;

      res.render('home.ejs', {
        alls: result,
        logs: log
      });
    })

  });

  //Afficher le profil d'un marsupilamis

  app.get('/show/:pseudo', function (req, res) {
    var pseudo = req.params.pseudo;
    // console.log(req.params._id)

    dbo.collection("id").find({
      pseudo: pseudo
    }).toArray(function (err, result) {
      if (err) throw err;

      res.render('profil.ejs', {
        alls: result
      });
    });
  });


  //Update profil d'un Marsupilami

  app.post('/update/:pseudo/', function (req, res) {
    var pseudo = req.params.pseudo;

    console.log(req.body);
    var new_username = req.body.username;
    var new_age = req.body.age;
    var new_famille = req.body.famille;
    var new_race = req.body.race;
    var new_nourriture = req.body.nourriture;

    var username = ""

    dbo.collection("id").find({
      "pseudo": pseudo
    }).toArray(function (err, r) {
      if (err) throw err;
      console.log(r[0]);
      username = r[0].pseudo
    });
    dbo.collection("id").updateMany({
      "pseudo": pseudo
    }, {
      $set: {
        'pseudo': new_username,
        'age': new_age,
        'famille': new_famille,
        'race': new_race,
        'nourriture': new_nourriture,
      }
    }, function (e, r) {
      if (e) {
        // console.log(e)
      } else if (r) {
        // console.log(r)
      }
    });
    res.redirect('/home');
  })


  app.get('/delete/:pseudo', function (req, res) {
    var pseudo = {
      pseudo: req.params.pseudo
    };
    console.log(pseudo)

    dbo.collection("id").deleteOne(pseudo, function (err, obj) {
      if (err) throw err;
      console.log(req.params.pseudo + " a été supprimer");
    });

    res.redirect('/home');
    // db.close();
  });

  //Connection
  app.get('/login', function (req, res) {
    res.render('login.ejs', {

    });
  });

  app.post('/login/submit', function (req, res) {
    var pseudo = req.body.username;
    var password = req.body.password;

    dbo.collection("id").find({
      "pseudo": pseudo
    }).toArray(function (err, r) {
      if (err) throw err;

      if (r[0].password === password) {
        localStorage.setItem('status', 'Login');

        console.log(pseudo + ' vient de se connecter')
        res.redirect('/home');
      } else {
        res.render('login.ejs', {
          session: pseudo
        });
      }
    });
  });
//Deconnection

app.get('/logout', function (req, res){
    localStorage.removeItem('status');
    res.redirect('/login');
  })
});

app.get('/register', function (req, res) {

  res.render('register.ejs', {

  });

});

console.log('connection')

app.listen(8080);