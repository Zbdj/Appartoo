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

const bcrypt = require('bcrypt');


const cors = require('cors');



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
    console.log(req.body)

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
    password = bcrypt.hashSync(password, 10);

    dbo.collection("id").insertOne({
      pseudo,
      password,
      age,
      famille,
      race,
      nourriture
    }, function (err, result) {
      if (err) throw err;
      console.log('OK')

      res.json('Inscription reussie');
    })


    // res.redirect('/login');
  });


  //Liste de tout les Marsupilamis
  app.get('/home/:id', function (req, res) {
    var log = req.params.id;

    //Liste des amis
    var test = [];

    //Liste des personnes pas en amis
    var test2 = [];

    dbo.collection("id").find({}).toArray(function (err, result) {
      if (err) throw err;

      dbo.collection("contact").find({
        user_id: log
      }).toArray(function (err, friends) {
        if (err) throw err;

        for (var a = 0; a < result.length; a++) {
          // console.log(result[a].pseudo)
          if ('' + result[a]._id + '' === log) {
            result.splice(a, 1)
          }
          for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < friends.length; j++) {
              if (friends[j].pseudo === result[i].pseudo) {
                result.splice(i, 1)
                break;
              }
            }
          }
        }

        res.json(result)

        // res.render('home.ejs', {
        //   alls: result,
        //   logs: log,
        //   friends: test
        // // });

      })

    })



  });

  //Afficher son profil
  app.get('/show/:id', function (req, res) {
    var id = req.params.id;

    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(id);

    // console.log(req.params.id)

    dbo.collection("id").find({
      _id: o_id
    }).toArray(function (err, result) {
      if (err) throw err;

      console.log(result);
      res.json(result);

      // res.render('profil.ejs', {
      //   alls: result,
      //   logs: log
      // });
    });
  });


  //Update profil d'un Marsupilami

  app.post('/update/:id/', function (req, res) {
    var id = req.params.id;

    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(id);

    console.log(req.body.nourriture);

    if (req.body.username !== "" && req.body.username !== undefined) {
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
        // console.log(r)
      });
    }

    if (req.body.age !== "" && req.body.age !== undefined) {
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

    if (req.body.famille !== "" && req.body.famille !== undefined) {
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
    if (req.body.race !== "" && req.body.race !== undefined) {
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
    if (req.body.nourriture !== "" && req.body.nourriture !== undefined) {
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
    // localStorage.removeItem('status');

    var id = req.params.id;
    var mongodb = require('mongodb');

    dbo.collection('id', function (err, collection) {
      collection.deleteOne({
        _id: new mongodb.ObjectID(id)
      }, function (err, results) {
        if (err) {
          throw err;
        }
        res.json(results)
      });
    });

    // res.redirect('/home');
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

    // console.log(password)
    dbo.collection("id").find({
      pseudo: pseudo,
      // password: password
    }).toArray(function (err, r) {
      if (err) throw err;

      if (r[0] === undefined) {
        res.json(erreur_ejs);
      }


      for (var i = 0; i < r.length; i++) {
        console.log(r[i].pseudo)
        console.log(pseudo)
        if (bcrypt.compareSync(password, r[i].password)) {
          res.json(r[i]);
        } else {
          res.json(erreur_ejs);
        }
      }

      // if (r[0]) {
      //   res.json(r[0]);

      // } else {
      //   res.json(erreur_ejs);
      //   // res.render('login.ejs', {
      //   //   e: erreur_ejs
      //   // });
      // }
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

    console.log(pseudo)
    console.log(id)

    dbo.collection("contact").insertOne({
      user_id: id,
      pseudo: pseudo
    }, function (err, result) {
      if (err) throw err;

      res.json(result)
    })

  })

  app.get('/friends/:id', function (req, res) {
    var id = req.params.id

    console.log(req.params.id)

    dbo.collection("contact").find({
      user_id: id
    }).toArray(function (err, result) {
      if (err) throw err;
      console.log(result)
      res.json(result)
      // res.render('friends.ejs', {
      //   friends: result,
      //   logs: id
      // });
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
      res.json(r);


      res.render('friends_show.ejs', {
        infos: r,
        logs: log
      });
    })
  })

  app.get('/delete/friends/:pseudo/:id', function (req, res) {
    var pseudo = req.params.pseudo
    // var id = req.params.id
    var log = req.params.id;
    dbo.collection('contact', function (err, collection) {
      collection.deleteOne({
        user_id: log,
        pseudo: pseudo
      }, function (err, results) {
        if (err) {
          // console.log("failed");
          throw err;
        }
        res.json(results)
        // console.log("success");
      });
    });

    // res.redirect('/home');

  })


  //Gestion des mauvaise route 404
  app.use(function (req, res, next) {

    res.setHeader('Content-Type', 'text/html');

    res.status(404).render('404.ejs');

  });

  //Fin de MongoDB/Client
});



app.use(cors());

console.log('connection au serveur 8080')

app.listen(8080);