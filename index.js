/*
Module Dependencies 
*/
var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    UserModel = require('./models/UserModel'),
    helper = require('./utils/helper'),
    login = require('./controllers/login'),
    register = require('./controllers/register'),
    hash = require('./pass').hash;

var app = express();

/*
Middlewares and configurations 
*/
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser('Authentication Tutorial '));
    app.use(express.session());
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

/*
Routes
*/

app.get("/search", function (req, res) {
    res.render("search");
});

app.get("/", function (req, res) {

    if (req.session.user) {
        res.redirect("/search");
    } else {
        res.send("<a href='/login'> Sign In</a>" + "<br>" + "<a href='/signup'> Register</a>");
    }
});

app.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("signup");
    }
});

app.post("/signup", helper.userExist, function (req, res) {
    register.registerHandler(req , res);
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    login.loginHandler(req, res);
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.get('/profile', helper.requiredAuthentication, function (req, res) {
    res.send('Profile page of '+ req.session.user.username +'<br>'+' click to <a href="/logout">logout</a>');
});


http.createServer(app).listen(3000);