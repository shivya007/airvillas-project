if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
//const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const googleRoute = require("./routes/google.js");


const flash = require("connect-flash");
// passport is a library
const passport = require("passport");
const LocalStrategy = require("passport-local");


const User = require("./models/user.js");
const Listing = require('./models/listing.js');


async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then(()=>{
    console.log("MongoDb connected Successfully");
})
.catch((error)=>{
    console.log("error occured", error);
})
const port = 8080;

app.listen(port, ()=>{
    console.log(`Server is listening on the port: ${port}`);
})
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () =>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 *24 *60 *60 *1000,
        maxAge:  7 *24 *60 *60 *1000,
        httpOnly: true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());  // it is necessary for passport to have sessions implemented already
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // this line mean all the new users are authenticated using localStrategy using authenticate method

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
app.get("/", (req, res, next)=>{
    res.redirect("/listings");
})
app.use("/auth/google", googleRoute);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
                    
app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
}); 
app.use((err, req, res, next)=>{
    let {status = 500, message = "Something went Wrong"} = err;
    res.status(status).render("listings/error.ejs", {err});
    //res.status(status).send(message);
});












/* app.get("/", (req, res)=>{
    res.send("connected");
});
 */







/* app.get("/demouser", async (req, res) =>{
    let fakeuser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });
//register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. See login example.
    let newuser = await User.register(fakeuser, "helloworld"); // this line saves the fakeuser info into the ddatabase
    res.send(newuser);
    // passport local mongoose internally implement the hashing function algorithm named: pbkdf2 hashing algorithm
});
 */
// middleware for validateSchema. Here we write validate Schema as a function to use it as a middleware
/*
const validateSchema = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errormsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errormsg);
    }
    else{
        next();
    }
}
*/

/*
const validateReview = (req, res, next) =>{
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
*/



// index route
/*
app.get("/listings", WrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

*/

// Create Operation --> new route
/*
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});
*/


// Read Operation --> show Route

/*
app.get("/listings/:id", WrapAsync(async (req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));
*/


//app.post("/listings", validateSchema, WrapAsync(async(req, res, next)=>{
    // one way of accessing variables is this: 
    // let { title, description, image, price, country, location} = req.body;
    // second way
    //let { listing } = req.body.listing;
    //console.log(listing); 
   /* if(!req.body.listing){
        throw new ExpressError(400, "Send Valid data for listing");
    }
    const newlisting = new Listing(req.body.listing);
    if(!newlisting.description){
        throw new ExpressError(400, "description is missing");
    }
    if(!newlisting.title){
        throw new ExpressError(400, "title is missing");
    }
    if(!newlisting.location){
        throw new ExpressError(400, "location is missing");
    }
        */
       // let's do upper hectic task in some lines of code 
       /*let result = listingSchema.validate(req.body);
       console.log(result);
       let newlisting = new Listing(req.body.listing);
       await newlisting.save();
       res.redirect("/listings");*/

       // Now we do above work as using a validatemiddleware and pass it as a function in this route
       //let result = listingSchema.validate(req.body);
       //console.log(result);
      /* const newlisting = new Listing(req.body.listing);
       await newlisting.save();
       res.redirect("/listings");
    }));*/

  // joy is a tool which helps us to validate schema instead of writitng this bulky code for checking the validation of schema
  //The most powerful schema description language and data validator for JavaScript.
  // with the help of joi, we define the schema, it is not that type of mongoose schema but it is a server side validator schema

// edit route

/*
app.get("/listings/:id/edit", WrapAsync(async (req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))

//Update Route
app.put("/listings/:id", validateSchema, WrapAsync(async (req, res)=>{
    let { id } = req.params;
    const updatedData = {
        ...req.body.listing,
        image: {
            url: req.body.listing.image.url,  // Only updating the URL, you can also handle filename if needed
            filename: req.body.listing.image.filename || "listingimage"  // Keep default if filename isn't updated
        }
    };
    await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    res.redirect(`/listings/${ id }`);
}));

// Delete Route

app.delete("/listings/:id", WrapAsync(async(req, res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
*/

// Reviews post route
/*
app.post("/listings/:id/reviews", validateReview, WrapAsync(async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));


// Reviews delete Route

app.delete("/listings/:id/reviews/:reviewId", WrapAsync(async(req, res) =>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
*/
/*
app.get("/testlisting", async(req, res)=>{
    let sampleListing = new Listing({
        title: "A Ganga Villa",
        description: "Aesthetic with moody vibes",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    });

    await sampleListing.save();
    console.log("Sample is saved");
    res.send("Sucess");
})
    */
    