require('dotenv').config();
let listing=require("../models/listing.js");
const Expresserror=require('../utils/Expresserror.js');
const maptoken='pk.eyJ1IjoiaHNhbmpheSIsImEiOiJjbHY0M2k3MDIwNHR3Mm1xdGVsamt4aHEwIn0.M6rBMLxXLBHHoSpHLN8AEA'
const mbxGeocoding =require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient= mbxGeocoding({accessToken:maptoken});

module.exports.index=async(req,res,next)=>{
    const all=await listing.find({});
    res.render('listings/index.ejs',{all});
 };

 module.exports.renderNewform=(req,res)=>{
    res.render('listings/new.ejs');
  };

 module.exports.showListing=async(req,res,next)=>{
    let {id}=req.params;
    let info=await  listing.findById(id).populate('owner').populate({path:'reviews',populate:{path:'author'}});
    if(!info){
     req.flash('error',"The listing you are looking for doesn't exist");
     res.redirect('/listings');
     return;
    };
    res.render('listings/show.ejs',{info});
};

module.exports.createListing=async(req,res,next)=>{

   let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
      .send();
       



    let l1=new listing(req.body.listing);
    l1.owner="66232e7f35dc634b2ad7223a";
    l1.image.path=req.file.path;
    l1.image.filename=req.file.filename;
    l1.geometry=response.body.features[0].geometry;
    await l1.save();

    req.flash('success',"Your listing has been created!");
    res.redirect("/listings");
   };

module.exports.renderUpdateForm=async(req,res,next)=>{
    let {id}=req.params;
    let find=await listing.findById(id);
    if(!find){
     req.flash('error',"The listing you are looking for doesn't exist");
     res.redirect('/listings');
     return;
    }
    let origurl=await find.image.path;
    origurl=await origurl.replace('/upload','/upload/h_300,w_250');
    res.render('listings/edit.ejs',{find,origurl} );
  };

module.exports.updateListing=async(req,res,next)=>{
    if(!req.body.listing){
      throw new Expresserror(400,"Send valid data for listing")
    };
    let {id}=req.params;
    let ulist= await listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true});
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      }).send();

       ulist.geometry=response.body.features[0].geometry;
       await ulist.save();

    if(req.file)
    {
        let path=req.file.path;
        let filename=req.file.filename;
        ulist.image={path,filename};
        await ulist.save();
    }
   
    req.flash('success',"listing updated!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.deleteListing=async(req,res,next)=>{
    let {id}=req.params;
    let result=await listing.findByIdAndDelete(id);
    req.flash('success',"listing deleted");
    res.redirect('/listings');
  };
