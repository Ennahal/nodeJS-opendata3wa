const express = require('express');

const app = express();

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function(req, res) {
    res.render('index');  
});

app.get('/login', function(req, res) {
    res.render('login');  
});

app.get('/signup', function(req, res) {
    res.render('signup');  
});

app.listen(8080);