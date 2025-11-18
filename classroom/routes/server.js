const express = require("express");
const app= express();
const session= require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionOption = {secret:"mysupersecretstring",resave:false,saveUninitialized:true};
app.use(session(sessionOption));
app.use(flash());

app.listen("3000",()=>{
    console.log("start");
})

app.get("/test",(req,res)=>{
   let {name="anonymous"} = req.query;
   req.session.name = name;
   req.flash("success","registered successfully");
   res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
   
   res.render("register.ejs",{msg:req.flash("success"),name:req.session.name});
})