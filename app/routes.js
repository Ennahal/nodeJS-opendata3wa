const User = require('./models/User.model.js')

module.exports = (app) =>
{

    app.get('/', function(req, res) {
        res.render('index');  
    });
    
    app.get('/login', function(req, res) {
        res.render('login');  
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
            res.redirect('/?signup=ok')
        })
    });
}