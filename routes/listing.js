const express=require('express');
const multer=require('multer');
const router=express.Router({mergeParams:true});
const Asyncwrap=require('../utils/Asyncwrap.js');
const {isLoggedIn,isOwner,valListing}=require('../middleware.js');
const listingController=require('../controller/listings.js');
const {storage}= require('../cloudConfig.js');
const upload=multer({storage});

// All listings
router.get('/',Asyncwrap(listingController.index));


router.route('/new/')
 .get(isLoggedIn,isOwner,listingController.renderNewform)
 .post(isLoggedIn,isOwner,upload.single('listing[image]'),valListing,Asyncwrap(listingController.createListing));


 //Show route
 router.route('/:id')
  .get(Asyncwrap(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),valListing,Asyncwrap(listingController.updateListing))
  .delete(isLoggedIn,isOwner,Asyncwrap(listingController.deleteListing));


 //Edit route
 router.get('/:id/edit',isLoggedIn,isOwner,Asyncwrap(listingController.renderUpdateForm));
 


 module.exports=router;