const express = require("express");
const router= express.Router();
//wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");

//listing model require
const Listing = require("../models/listing.js");
const passport = require("passport");

//middleware require
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const multer = require("multer");
const {storage}=  require("../cloudConfig.js");

const upload = multer({storage}); 

//index route
router.get("/", wrapAsync(async (req, res) => {
 let alllist = await Listing.find();
 res.render("listing/home.ejs", { alllist });
}))

//create route
router.get("/new",isLoggedIn,(req, res) => {

    res.render("listing/new.ejs");

})

//show route
router.get("/:id", wrapAsync(async (req, res) => {
 let { id } = req.params;
 let list = await Listing.findById(id, {}).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
 if(!list)
 {
    req.flash("error","list was not found");
    res.redirect("/listing");
 }
 else{ 
 res.render("listing/show.ejs", { list });
 }
}))


router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(async (req, res) => {

    // console.log(req.body);
    let url = req.file.path;
    let filename = req.file.filename;
    let newlist = new Listing(req.body.listing);
    newlist.owner = req.user._id;
    newlist.image = {url,filename};
    await newlist.save();
    req.flash("success","list successfully added!");
    res.redirect("/listing");

}))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
     let { id } = req.params;
    let list = await Listing.findById(id);
    if(!list)
 {
    req.flash("error","list was not found");
    res.redirect("/listing");
 }
 else{ 
    res.render("listing/edit.ejs",{list});
}}))

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
       let {id} = req.params;
       await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success","list updated successfully!");
    res.redirect(`/listing/${id}`);
   
}))


//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","list deleted successfully!");
    res.redirect("/listing");
   
}))

module.exports = router;
