// Chargement de la configuration selon l'environnement
require('dotenv').config();

// Inclusion des dépendances (=modules) du projet
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

// Création d'une nouvelle application Express.js (c.f. http://expressjs.com/en/starter/hello-world.html)
const app = express();

/**
 * Configuration des middlewares de l'application
 */

app.use(express.static('public')) // Middleware pour les fichiers statiques : http://expressjs.com/fr/starter/static-files.html
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
    secret: 'opendata3wa rocks',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
  app.use(flash())
  app.use((req, res, next) =>{
      app.locals.flashMessages = req.flash()
      next()
  })


app.use(passport.initialize())
app.use(passport.session())  

// Configuration de l'application Express  
app.set('views', './views') // Indique que le dossier /views/ contient les fichiers .pug
app.set('view engine', 'pug') // Configuration du moteur de template utilisé

// Gestion des routes de l'application dans un fichier à part
require('./app/passport')(passport)
require("./app/routes")(app, passport)

// Connexion à la base mongo ...    
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`, { useNewUrlParser: true } )
    .then(() =>
    {
        app.listen(8080, () =>
        {
            console.log('localhost:8080')
        });
    })
