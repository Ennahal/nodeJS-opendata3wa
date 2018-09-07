const User = require('./models/User.model.js')

module.exports = (app, passport) =>
{
     // Ce petit middleware met à disposition des variables pour toutes les 'views' Pug de l'application
	app.use((req, res, next) => {
    	app.locals.user = req.user // Récupération de l'objet 'user' (sera existant si une session est ouverte, et undefined dans le cas contraire)
        next()
    })

    app.get('/', function(req, res) {
        res.render('index');  
    });
    
    app.get('/login', function(req, res) {
        res.render('login');  
    });
    // Lorsqu'on tente de se connecter, c'est le middleware de passport qui prend la main, avec la stratégie "locale" (configurée dans ./passport.js )
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        badRequestMessage: 'Identifiants nons valides!',
        failureFlash: true,
        successFlash: { message: 'Connexion réussie. Bienvenue !' }
    }));

    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', {
    	successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: { message: 'Connexion réussie avec Github. Bienvenue !' }
    }));

    
    app.get('/logout', function(req, res) {
        req.session.destroy()
        req.logout()
        res.redirect('/') 
    });
    
    app.get('/signup', function(req, res) {
        res.render('signup');  
    });

    app.post('/signup', function(req, res) {
        User.signup(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password,
            req.body.confirmPassword
        ).then(() =>{
            req.flash('success', 'bienvenue')
            res.redirect('/')
        }).catch(err =>{
            res.render("signup.pug", {err: err.errors})
        })
    });
}