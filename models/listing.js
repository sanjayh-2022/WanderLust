const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const review=require('./reviews.js');
const listschema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {    
        path:String,
        filename:String
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: 'review'
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});
listschema.post("findOneAndDelete", async (listing) => {
    if(listing){
         await review.deleteMany({_id:{$in:listing.reviews}}) ;
    }
});
let Listing = mongoose.model('Listing', listschema);

module.exports = Listing;
