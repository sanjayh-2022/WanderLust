let User=require("../models/user.js");


module.exports.renderSignUpForm=async(req,res)=>{
    
    res.render('users/signup.ejs');
    };

module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let  user=new User({username,email});
        let reguser=await User.register(user,password);
        req.login(reguser,(err)=>{
            if (err) return next(err);
            req.flash('success','Welcome to WanderLust');
            res.redirect('/listings'); 
        });
    }
        
    catch(err){
        req.flash('error',err.message)
    res.redirect('/signup');
};
};


module.exports.renderLoginForm=async(req,res)=>{
    res.render('users/login.ejs');
};


module.exports.login=async(req,res)=>{
    req.flash('success','Welcome back to WanderLust');
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return  next(err);
        }
        req.flash('success','Successfully logged out');
        res.redirect('/listings');
    });
}
