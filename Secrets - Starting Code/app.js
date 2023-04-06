//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();



app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: "my name is singh",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

main().catch(err=>console.log(err));
async function main(){
    await mongoose.connect("mongodb://127.0.0.1/userDB");
    console.log("connected");


    const userSchema = new mongoose.Schema({
        email: String,
        password: String
    });

    userSchema.plugin(passportLocalMongoose);

   

    const User = new mongoose.model("User", userSchema);

    passport.use(User.createStrategy());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


    app.post("/register", function(req,res){
        User.register({username: req.body.username}, req.body.password)
        .then(function(){
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
            });
        })
        .catch(function(err){
            console.log(err);
            res.redirect("/register");
        });

       
        
    });

    app.post("/login", function(req,res){

        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, function(err){
            if(err){
                console.log(err);
            }else{
                passport.authenticate("local")(req,res, function(){
                    res.redirect("/secrets");
                });

            };

        });
        
        
    });  







}


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
}); 

app.get("/secrets", function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    } else{
        res.redirect("/login");
    }
});

app.get("/logout", function(req,res,next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });

//hii







app.listen(3000,function(){
    console.log("server started at port 3000");
});