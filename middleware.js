let listing=require('./models/listing');
let review=require('./models/reviews');
const Expresserror=require('./utils/Expresserror.js');
const {Listingschema,reviewSchema}=require('./schema.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must login first');
        return res.redirect('/login') ;
      }
      next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    if(!(res.locals.currUser._id.equals(res.locals.realownerid)))
   {
    req.flash('error',"You don't have the permission");
    return res.redirect(`/listings/${id}`);
   }
   next();
};


module.exports.valListing=(req,res,next)=>{
    let {error}= Listingschema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=> el.message.split('.').pop().replace(/["']/g, '')).join(',');
     throw new Expresserror(400,errMsg);
    }
    else next();
  };

  module.exports.valReview= (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=> el.message.split('.').pop().replace(/["']/g, '')).join(',');
     throw new Expresserror(400,errMsg);
    }
    else next();
  };

  module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewid}=req.params;
    let reviews=await review.findById(reviewid);
    if(!(res.locals.currUser._id.equals(reviews.author)))
   {
    req.flash('error',"You are not the author of this review");
    return res.redirect(`/listings/${id}`);
   }
   next();
};