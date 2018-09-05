require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.set('views', './views')
app.set('view engine', 'pug')

require("./app/routes")(app)

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`, { useNewUrlParser: true } )
    .then(() =>
    {
        app.listen(8080, () =>
        {
            console.log('localhost:8080')
        });
    })
