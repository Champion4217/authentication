//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
main().catch(err=>console.log(err));

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1/userDB");
    console.log("connected");


    const userSchema = new mongoose.Schema({
        email: String,
        password: String
    });

    const User = new mongoose.model("User", userSchema);


    app.post("/register", function(req,res){
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save()
        .then(function(){
            res.render("secrets");
        })
        .catch(function(err){
            console.log(err);
        });
    });

    app.post("/login", function(req,res){
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email:username})
        .then(function(foundUser){
            if(foundUser.password===password){
                res.render("secrets");
            };
        })
        .catch(function(err){
            console.log(err);
        });
    });  







}


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("register");
});

app.get("/register", function(req,res){
    res.render("register");
}); 








app.listen(3000,function(){
    console.log("server started at port 3000");
});