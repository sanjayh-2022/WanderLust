const joi=require('joi');
module.exports.Listingschema=joi.object({
   listing:joi.object({title:joi.string().min(2).max(100).required(),
    description:joi.string().required(),
    price:joi.number().min(0).required(),
    location:joi.string().required(),
    country:joi.string().required(),
    image:joi.string().allow('',null)}).required()
});

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().min(1).max(5),
        comment:joi.string().required(),
    }).required(),
});