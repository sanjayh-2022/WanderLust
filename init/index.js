const mongoose=require('mongoose');
let initdata=require('./data.js');
let listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require('dotenv').config();
const maptoken=process.env.Map_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: maptoken });
console.log(maptoken,geocodingClient);
 dbUrl=process.env.ATLAS_DB_URl;
main().then((res)=>{
    console.log(`MongoDB connection succesfull`);
 }).catch((err)=>console.error(err));
  async function main(){
    await mongoose.connect(dbUrl)
};
let add= async()=>{
  await listing.deleteMany({});
  initdata.data=initdata.data.map((obj)=>({...obj,owner:"66232e7f35dc634b2ad7223a"}));
  for(data of initdata.data){
    let response= await geocodingClient.forwardGeocode({
      query: data.location,
      limit: 2
    })
    .send();
    data.geometry=response.body.features[0].geometry;
    console.log(data.geometry);
  }
  await listing.insertMany(initdata.data);

};
add();
