const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');


//Login page
router.get('/login', function(req, res){
    res.render('login');
});

//Login handle
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Logout handle
router.get('/logout', (req, res)=>{
    req.logOut();
    req.flash('success_msg', 'You are  logged out');
    res.redirect('/users/login');
})

//Register page
router.get('/register', function(req, res){
    res.render('register');
});

//Register handle
router.post('/register', function(req, res){
    const {name, password, email, password2} = req.body;
    let errors = [];
    if(!name || !email || !password  || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }

    //Check password match
    if (password !== password2) {
        errors.push({msg: 'Password do not match'});
    }

    //Check password lengh
    if (password.lengh) {
        errors.push({msg: 'Password should be at least 6 characters'})
    }
    
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            password,
            password2,
            email
        })
    }else {
        //Validation passed
        User.findOne({email: email})
        .then(user => {
            if(user){
                errors.push({msg: 'User already registered'})
                res.render('register', {
                errors,
                name,
                password,
                password2,
                email
                })
            }else{
                const newUser = new User({
                    email,
                    password,
                    name,
                });
                //Hash password
                bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    //Set password to hashed
                    newUser.password = hash;
                    newUser.save((err, doc)=>{
                        req.flash('success_msg', 'You are now registed and can log in')
                        res.redirect('/users/login');
                    }); 
                }))
                
                console.log(newUser);

            }
        });
    }
});


module.exports = router;