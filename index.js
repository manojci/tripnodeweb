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
    city = require('./controllers/city'),
    route = require('./controllers/route'),
    search = require('./controllers/search'),
    hash = require('./utils/crypto').hash;

var app = express();
var travelDetails;
var cityinfo;

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

app.get("/cleartrip/user/home", helper.requiredAuthentication, function (req, res) {
    res.render("home");
});
app.get("/cleartrip/user/search", helper.requiredAuthentication, function (req, res) {
    city.citySearchHandler(req, res, function (err, citylist) {
        if(err !== undefined) {
            req.session.error = "City Service Not Available.Please contact the administrator.";
            res.redirect('/cleartrip/user/home');
        } else {
            cityinfo = citylist;
            res.redirect("/cleartrip/citysearch");
        }
    });
});
app.get("/cleartrip/admin/search", helper.requiredAuthentication, function (req, res) {
    city.citySearchHandler(req, res, function (err, citylist) {
        if(err !== undefined) {
            req.session.error = "City Service Not Available.Please contact the administrator.";
            res.redirect('/cleartrip/admin/home');
        } else {
            cityinfo = citylist;
            res.redirect("/cleartrip/citysearch");
        }
    });
});
app.get("/cleartrip/citysearch", helper.requiredAuthentication, function (req, res) {
    res.render("search", {citylist : cityinfo});
});
app.get("/cleartrip/route", helper.requiredAuthentication, function (req, res) {
    city.citySearchHandler(req, res, function (err, citylist) {
        if(err !== undefined) {
            req.session.error = "City Service Not Available.Please contact the administrator.";
            res.redirect('/cleartrip/admin/home');
        } else {
            cityinfo = citylist;
            res.redirect("/cleartrip/add/route");
        }
    });
});
app.get("/cleartrip/add/route", helper.requiredAuthentication, function (req, res) {
    res.render("route", {citylist : cityinfo});
});
app.get("/cleartrip/fare", helper.requiredAuthentication, function (req, res) {
    res.render("fare");
});
app.get("/cleartrip/flight", helper.requiredAuthentication, function (req, res) {
    res.render("flight");
});
app.get("/cleartrip/admin/home", helper.requiredAuthentication, function (req, res) {
    res.render("admin");
});
app.get("/cleartrip", function (req, res) {
    if (req.session.user) {
        res.redirect("/cleartrip/user/home");
    } else {
        res.send("<a href='/cleartrip/login'> Sign In</a>" + "<br>" + "<a href='/cleartrip/register'> Register</a>");
    }
});

app.get("/cleartrip/register", function (req, res) {
    if (req.session.user) {
        res.redirect("/cleartrip");
    } else {
        res.render("register");
    }
});

app.post("/cleartrip/add/route", function (req, res) {
    route.routeHandler(req , res);
});

app.post("/cleartrip/register", helper.userExist, function (req, res) {
    register.registerHandler(req , res);
});

app.get("/cleartrip/login", function (req, res) {
    res.render("login");
});

app.get("/cleartrip/travelinfo", helper.requiredAuthentication, function (req, res) {
    res.render("travelinfo", {travelinfo : travelDetails});
});

app.post("/cleartrip/login", function (req, res) {
    login.loginHandler(req, res);
});

app.post("/cleartrip/search", function (req, res) {
    search.searchHandler(req, res, function (err, travelinfo) {
        travelDetails = travelinfo;
        res.redirect("/cleartrip/travelinfo");
    });
});

app.get('/cleartrip/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/cleartrip');
    });
});

app.get('/cleartrip/profile', helper.requiredAuthentication, function (req, res) {
    res.send('Profile page of '+ req.session.user.username +'<br>'+' click to <a href="/logout">logout</a>');
});


http.createServer(app).listen(3000);