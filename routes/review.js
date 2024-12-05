const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const {reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { postReview, deleteReview } = require("../controllers/reviews.js");


router.post("/", isLoggedIn ,validateReview, WrapAsync(postReview));


// Reviews delete Route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, WrapAsync(deleteReview));


module.exports = router;