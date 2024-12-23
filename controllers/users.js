const User = require("../models/user.js");
const { v4: uuidv4 } = require('uuid');

module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup.ejs");
}


module.exports.signup = async(req, res) =>{
    try{
    let {username, email, password, googleId} = req.body;
    // Check if a user with the same googleId exists (for Google signups)
    if (googleId != null) {
        const existingGoogleUser = await User.findOne({ googleId });
        if (existingGoogleUser) {
            req.flash("error", "This Google account is already linked to a user.");
            return res.redirect("/signup");
        }
    }
    // Check if a user with the same email exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
           req.flash("error", "This email is already registered.");
           return res.redirect("/signup");
    }
    const newGoogleId = googleId ? googleId : uuidv4();
    const newUser = new User({email, username, googleId: newGoogleId});
    //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. See login example.
    const registereduser = await User.register(newUser, password);
    console.log(registereduser);
    req.login(registereduser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", `${username} registered successfully!`);
        res.redirect("/listings");

    })  
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
}

module.exports.login = async(req, res) =>{
    req.flash("success", `${req.user.username} login successfully!` || `${req.user.name} login successfully!` );
    //res.redirect("/listings");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) =>{
        if(err){
            next(err);
        }
        req.flash("success", "logged out successfully");
        res.redirect("/listings");
    })
}