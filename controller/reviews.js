let listing=require("../models/listing.js");
const review=require('../models/reviews.js');
const Expresserror=require('../utils/Expresserror.js');



module.exports.createReview=async(req,res,next)=>{
    let list= await listing.findById(req.params.id);
    let rev= new review(req.body.review);
    rev.author=req.user._id;
    list.reviews.push(rev);
    await rev.save();
    await list.save();
    req.flash('success',"Review Added");
    res.redirect(`/listings/${req.params.id}`);
 }

 module.exports.deleteReview=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let remove= await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash('success',"Review deleted");
    res.redirect(`/listings/${id}`);
  }