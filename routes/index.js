const express = require('express');
const route = express.Router();
const {ensureAuthenticated} = require('./../config/auth')

route.get('/', function(req, res){
    res.render('welcome');
});

route.get('/dashboard', ensureAuthenticated, function(req, res){
    res.render('dashboard', {
        name: req.user.name
    });
});


module.exports = route;