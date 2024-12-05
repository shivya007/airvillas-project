const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateSchema} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing, searchbar, filter } = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.get("/filter/:id", WrapAsync(filter));

router.get("/search", searchbar);

router.route("/")
.get(WrapAsync(index))
.post(isLoggedIn, upload.single('listing[image]'), validateSchema, WrapAsync(createListing))




// Create Operation --> new route
router.get("/new", isLoggedIn, renderNewForm);


router.route("/:id")
.get(WrapAsync(showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'), validateSchema,WrapAsync(updateListing))
.delete(isLoggedIn,isOwner, WrapAsync(deleteListing));


// edit route
router.get("/:id/edit", isLoggedIn, isOwner,WrapAsync(renderEditForm));

// index route
//router.get("/",WrapAsync(index));




// Read Operation --> show Route
//router.get("/:id",WrapAsync(showListing));

// Create Route
//router.post("/", isLoggedIn, validateSchema, WrapAsync(createListing));



//Update Route
//router.put("/:id",isLoggedIn,isOwner, validateSchema,WrapAsync(updateListing));

// Delete Route
//router.delete("/:id",isLoggedIn,isOwner, WrapAsync(deleteListing));







module.exports = router;