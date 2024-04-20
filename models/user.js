const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');


const schema=new Schema({
    email:{
        type:String, 
        required:true
    }
});
schema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",schema);