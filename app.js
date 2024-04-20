
require('dotenv').config();
const mongoose=require('mongoose');
const express=require('express');
const app=express();
const path=require('path');
const session=require('express-session');
const port=8080;
const passport=require("passport");
const localStrat=require('passport-local');
const User=require('./models/user.js');
const Expresserror=require('./utils/Expresserror.js');
const reviewsroute=require('./routes/review.js');
const listingsroute=require('./routes/listing.js');
const userroute=require('./routes/user.js');
let ejsmate=require("ejs-mate");
const methodoverride=require('method-override');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('ejs',ejsmate);
app.use(methodoverride("_method"));
const dbUrl=process.env.ATLAS_DB_URL;
//sessionOptions ans store options

const store=MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:process.env.SECRET
  },
  touchAfter:24*3600,
});

store.on('error',()=>{
  console.log("Error in Mongo session Store",err);
})

sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};



//using sessions and Flash
app.use(session(sessionOptions))
app.use(flash());


//Using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});
    
  
//mongodb connection
main().then((res)=>{
    console.log(`MongoDB connection succesfull`);
 }).catch((err)=>console.error(err)); 
  async function main(){
    await mongoose.connect(dbUrl)
};

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  res.locals.realownerid="66232e7f35dc634b2ad7223a";
  next();
});




 app.use('/listings',listingsroute);
 app.use('/listings/:id/review',reviewsroute);
 app.use('/',userroute);

app.all('*',(req,res,next)=>{
  next(new Expresserror(404,"Page not found!"));
});

//Error handling

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render('listings/error.ejs',{message});
});
