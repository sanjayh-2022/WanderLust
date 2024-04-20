const express=require('express');
const router=express.Router({mergeParams:true});
const Asyncwrap=require('../utils/Asyncwrap.js');
let listing=require("../models/listing.js");
const review=require('../models/reviews.js');
const {valReview, isLoggedIn, isReviewAuthor}=require('../middleware.js');
const { createReview, deleteReview } = require('../controller/reviews.js');



//Review
router.post('/',isLoggedIn,valReview,Asyncwrap(createReview));
 
 
 //review delete
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,Asyncwrap(deleteReview));
 
 module.exports=router;