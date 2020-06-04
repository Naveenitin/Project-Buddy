var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./modules/user");
var project = require("./modules/project");

var URL = process.env.databaseURL || 'mongodb://localhost:27017/project-buddy' ;
mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});

//  app configurations
var app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(expressSanitizer());
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
            res.redirect("/dashboard");
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
    project.find(function(err,data){
        if(err){
            console.log(err);
        } else {
            // console.log(data);
            res.render("home",{login:req.isAuthenticated(),data});
        }

    });
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
    req.body.project.description = req.sanitize(req.body.project.description);
    project.create(req.body.project,function(err,newProject){
        if(err){
            console.log(err);
        } else {
            // console.log(newProject);
            res.redirect("/");
        }
    });
});

//  search
app.get("/search?:a",(req,res)=>{
    project.find(function(err,data){
        if(err){
            console.log(err);
        } else {
            var arr = req.query.q.split(' ');
            data.forEach(obj => {
                arr.forEach( find => {
                    
                    obj.s = count(obj.name,find)*10 + count(obj.idea)*3 + count(obj.description,find); 
                });
            });
            data.sort((a,b)=>(a.s > b.s) ? 1 : ((b.s > a.s) ? -1 : 0));
            res.render("search",{login:req.isAuthenticated(),data});
        }

    });
});
function count(main_str, sub_str) 
{
    main_str += '';
    sub_str += '';

    if (sub_str.length <= 0) 
    {
        return main_str.length + 1;
    }

       subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
       return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
}

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

// default route if nothing match
app.get("*",(req,res)=>{
    res.send("Sorry!!!! This Webpage is not available");
});

var port= process.env.PORT || 3000 ;
app.listen(port,process.env.IP,()=>{
    console.log("Server is started");
});