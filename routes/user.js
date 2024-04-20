const express=require('express');
const router=express.Router({mergeParams:true});
const Asyncwrap=require('../utils/Asyncwrap.js');
const passport=require('passport');
const { isLoggedIn } = require('../middleware.js');
const {saveRedirectUrl} = require('../middleware.js');
const userController=require('../controller/users.js');



router.route('/signup')
 .get(Asyncwrap(userController.renderSignUpForm))
 .post(Asyncwrap(userController.signUp));


router.route('/login')
 .get(Asyncwrap(userController.renderLoginForm))
 .post(saveRedirectUrl,passport.authenticate('local',{
    failureRedirect:'/login',failureFlash:true
}),Asyncwrap(userController.login));


router.get('/logout',isLoggedIn,userController.logout);

 module.exports=router;