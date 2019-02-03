var express = require('express');
var app = express();

var localStorage = require('localStorage');


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname));

var MongoClient = require('mongodb').MongoClient;


// Database
MongoClient.connect("mongodb+srv://Zbdj:root@cluster0-lfpq5.mongodb.net/test?retryWrites=true", {
  useNewUrlParser: true
}, function (err, db) {
  if (!err) {
    console.log("Connection Mongo OK");
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

    if (pseudo.length === 0 || password.length === 0 || age.length === 0 || famille.length === 0 || race.length === 0 || nourriture.length === 0) {
      var empty = "empty";
      res.render('register.ejs', {
        empty: empty
      });
    }

    dbo.collection("id").insertOne({
      pseudo,
      password,
      age,
      famille,
      race,
      nourriture
    }, function (err, result) {
      if (err) throw err;
    })

    res.redirect('/login');
  });


  //Liste de tout les Marsupilamis
  app.get('/home', function (req, res) {
    var log = localStorage.getItem('status');
    var test = [];


    dbo.collection("id").find({}).toArray(function (err, result) {
      if (err) throw err;

      dbo.collection("contact").find({
        user_id: log
      }).toArray(function (err, friends) {
        if (err) throw err;
        // console.log(friends)
        friends.forEach(function (item) {
          test.push(item);
        })
        
        res.render('home.ejs', {
          alls: result,
          logs: log,
          friends: test
        });
      })
    })



  });

  //Afficher son profil
  app.get('/show/:id', function (req, res) {
    var id = req.params.id;
    var log = localStorage.getItem('status');

    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(id);

    // console.log(req.params.id)

    dbo.collection("id").find({
      _id: o_id
    }).toArray(function (err, result) {
      if (err) throw err;

      // console.log(result);

      res.render('profil.ejs', {
        alls: result,
        logs: log
      });
    });
  });


  //Update profil d'un Marsupilami

  app.post('/update/:id/', function (req, res) {
    var id = req.params.id;

    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(id);

    if (req.body.username !== "") {
      dbo.collection("id").updateOne({
        _id: o_id
      }, {
        $set: {
          'pseudo': req.body.username
        }
      }, function (e, r) {
        if (e) {
          // console.log(e)
        }
      });
    }

    if (req.body.age !== "") {
      dbo.collection("id").updateOne({
        _id: o_id
      }, {
        $set: {
          'age': req.body.age
        }
      }, function (e, r) {
        if (e) {
          // console.log(e)
        }
      });
    }

    if (req.body.famille !== "") {
      dbo.collection("id").updateOne({
        _id: o_id
      }, {
        $set: {
          'famille': req.body.famille
        }
      }, function (e, r) {
        if (e) {
          // console.log(e)
        }
      });
    }
    if (req.body.race !== "") {
      dbo.collection("id").updateOne({
        _id: o_id
      }, {
        $set: {
          'race': req.body.race
        }
      }, function (e, r) {
        if (e) {
          // console.log(e)
        }
      });
    }
    if (req.body.nourriture !== "") {
      dbo.collection("id").updateOne({
        _id: o_id
      }, {
        $set: {
          'nourriture': req.body.nourriture
        }
      }, function (e, r) {
        if (e) {
          // console.log(e)
        }
      });
    }

    res.redirect('/show/' + id);

  })

  //Supprimer son compte
  app.get('/delete/:id', function (req, res) {
    localStorage.removeItem('status');

    var id = req.params.id;
    var mongodb = require('mongodb');

    dbo.collection('id', function (err, collection) {
      collection.deleteOne({
        _id: new mongodb.ObjectID(id)
      }, function (err, results) {
        if (err) {
          // console.log("failed");
          throw err;
        }
        // console.log("success");
      });
    });

    res.redirect('/home');
  });

  //Connection
  app.get('/login', function (req, res) {
    res.render('login.ejs', {

    });
  });

  app.post('/login/submit', function (req, res) {
    var pseudo = req.body.username;
    var password = req.body.password;

    var erreur_ejs = 'Les identifiants ne correspondent pas essayez à nouveau !';

    dbo.collection("id").find({
      pseudo: pseudo,
      password: password
    }).toArray(function (err, r) {
      if (err) throw err;

      if (r[0]) {
        // console.log(r);
        localStorage.setItem('status', r[0]._id);
        res.redirect('/home');
      } else {
        res.render('login.ejs', {
          e: erreur_ejs
        });
      }
    });
  });

  //Deconnection
  app.get('/logout', function (req, res) {
    localStorage.removeItem('status');
    res.redirect('/login');
  })

  //Vue du formulaire register
  app.get('/register', function (req, res) {

    res.render('register.ejs', {

    });
  });


  //Fonctionnalité contact
  app.get('/add/:pseudo/:id', function (req, res) {
    var pseudo = req.params.pseudo
    var id = req.params.id

    dbo.collection("contact").insertOne({
      user_id: id,
      pseudo: pseudo
    }, function (err, result) {
      if (err) throw err;
      res.redirect('/home');
    })

  })

  app.get('/friends/:id', function (req, res) {
    var id = req.params.id

    // console.log(req.params.id)

    dbo.collection("contact").find({
      user_id: id
    }).toArray(function (err, result) {
      if (err) throw err;
      // console.log(result)

      res.render('friends.ejs', {
        friends: result,
        logs: id
      });
    })
  })

  app.get('/friends/show/:pseudo', function (req, res) {
    var pseudo = req.params.pseudo
    // var id = req.params.id
    var log = localStorage.getItem('status');

    dbo.collection("id").find({
      pseudo: pseudo,
    }).toArray(function (err, r) {
      if (err) throw err;
      res.render('friends_show.ejs', {
        infos: r,
        logs: log
      });
    })
  })

  app.get('/delete/friends/:pseudo', function (req, res) {
    var pseudo = req.params.pseudo
    // var id = req.params.id
    var log = localStorage.getItem('status');
    dbo.collection('contact', function (err, collection) {
      collection.deleteOne({
        user_id: log,
        pseudo: pseudo
      }, function (err, results) {
        if (err) {
          // console.log("failed");
          throw err;
        }
        // console.log("success");
      });
    });

    res.redirect('/home');

  })


  //Gestion des mauvaise route 404
  app.use(function (req, res, next) {

    res.setHeader('Content-Type', 'text/html');

    res.status(404).render('404.ejs');

  });

  //Fin de MongoDB/Client
});




console.log('connection au serveur 8080')

app.listen(8080);