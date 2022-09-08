var express = require("express");
var app = express() ; 
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var additem = require("./model/additem");
var passport = require('passport');
var localstrategy = require('passport-local');
var user = require('./model/user');
var methodOverride = require('method-override');
var path = require('path');
const catchasync = require('./utils/catchAsync');
const expresserror = require('./utils/expresserror');
var flash = require('connect-flash');
var home = require('./routes/home');


mongoose.connect("mongodb://localhost/mybag");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=> {
    console.log("database connected")
})


//passport configuration

app.use(require("express-session")({
   secret:"secret",
   resave: false,
   saveUninitialized: true,
   cookie: {
    httpOnly: true,
    expires: Date.now()+1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
   }
     
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride('_method'));
app.set("views", path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname ,'public')));
app.use(flash());
app.get('/', function(req,res){
    
    res.render("login");
});    

app.post('/', passport.authenticate("local", 
{
    successRedirect: "/home" , 
    failureRedirect:"/",

}), function(req,res){  });

app.get('/register', function(req,res) {
    res.render("register");  
});  

app.post('/register', function(req,res){
    var newUser = new user({username:req.body.username});
    user.register(newUser,req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
                res.redirect("/home");
            });
       });  
});


app.get('/logout', catchasync(async(req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      else {res.redirect('/home') }
    });
  }));  
  
  app.use("/home", home)
  
  app.all('*', (req,res,next) => {
    next(new expresserror('Page Not Found', 404))
  })

  app.use((err,req,res,next) => {
    const { statusCode = 500 , message = 'something is wrong please go back' + '/home'} = err;
    res.status(statusCode).render('404', {err})
    next();
  })
        
  
       
app.listen(8000);
console.log('Server is listening on port 8000 http://localhost:8000');   