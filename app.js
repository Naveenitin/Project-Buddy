var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./modules/user");
var URL = process.env.databaseURL || 'mongodb://localhost:27017/project-buddy' ;
mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});

//  app configurations
var app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(require("express-session")({
    secret:"This is used encode and decode session,this can be anything",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//  passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//=======================
//******  ROUTES  *******
//=======================



//  show sign up form
app.get("/register",prevent,function(req,res){
    res.render("register");
});


//  handling user sign up
app.post("/register",function(req,res){
    User.register(new User({username: req.body.username,firstname: req.body.firstname,lastname: req.body.lastname,email: req.body.email}), req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});


// LOGIN ROUTES
// render login form
app.get("/login",prevent,function(req,res){
    res.render("login");
});

//login logic
app.post("/login",passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}),function(req,res){
});



app.get("/",function(req,res){
    res.render("home",{login:req.isAuthenticated()});
});

app.get("/dashboard",isLoggedIn,function(req,res){
    // console.log(req.user); Gives the information of user except password
    res.render("dashboard",{login:req.isAuthenticated(),user: req.user});
});

app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
});

// Upload project
app.get("/add",isLoggedIn,(req,res)=>{
    res.render("add",{login:req.isAuthenticated(),user: req.user});
});
app.post("/add",isLoggedIn,(req,res)=>{
    // console.log(req.body);
    res.redirect("/");
});

//  function is used to check to whether user is logged in or not
//  this is used as middle function
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//  this is function prevent access and login page from loged in user.
function prevent(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

app.get("*",(req,res)=>{
    res.redirect("/");
});

var port= process.env.PORT || 3000 ;
app.listen(port,process.env.IP,()=>{
    console.log("Server is started");
});