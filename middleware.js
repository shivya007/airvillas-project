const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // this line ensures that the original link which is clicked before login , it is directly redirects to same original link which is clicked by the user
        req.flash("error", "You must be logged in to add your home!");
        return res.redirect("/login");
      }
      next();
}

module.exports.savedRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "Access Denied!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateSchema = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errormsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errormsg);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errormsg = error.details.map((el)=> el.message).join(",");
        console.log(error);
        throw new ExpressError(400, errormsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) =>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error", "Access Denied!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

