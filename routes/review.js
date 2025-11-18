const express = require("express");
const router = express.Router({mergeParams:true});

//wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");

//middleware require
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");

//Review model require
const Review = require("../models/review.js");



//listing js require
const Listing = require("../models/listing.js");



// create reviews route
router.post("/",isLoggedIn,validateReview,async (req,res)=>{
    let {id}=req.params;
    let newReview=new Review(req.body.review);
    let listing = await Listing.findById(id);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await listing.save();
    await newReview.save();
    req.flash("success","review successfully added!");
    res.redirect(`/listing/${id}`);
})

// delete reviews route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async (req,res)=>{
    
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted successfully!");
    res.redirect(`/listing/${id}`);
   
}))

module.exports = router;