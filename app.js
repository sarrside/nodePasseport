const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



//DB config
const db = require('./config/keys').MongoURI;

//Passport config
require('./config/passport')(passport)
//mongoose connect
mongoose.connect(db, {useNewUrlParser: true})
    .then(()=>
    console.log('database conneted'))
    .catch(err=>{
        console.log(erro)
    });
const  expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 5000;



app.use(expressLayout);
app.use(express.static(__dirname + '/publics'));
app.set('view engine', 'ejs');
//BodyParser
app.use(express.urlencoded({extended: true}));
//Expression session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//Connect flash
app.use(flash())
//Globals vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));
app.listen(PORT, function(){
    console.log(`Server started at http://localhost:${PORT}`);
})