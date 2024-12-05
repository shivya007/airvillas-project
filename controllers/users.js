const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup.ejs");
}


module.exports.signup = async(req, res) =>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
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
    req.flash("success", "login successfully!");
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