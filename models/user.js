const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


//You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String, // Optional for Google auth
    },
    googleId: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
});

// this line ensures salting hashing and username is automatically implemented by passport local mongoose into db
// Add passport-local-mongoose plugin for local auth
userSchema.plugin(passportLocalMongoose, {
    usernameField: "username", // Use username for local authentication
    selectFields: "username email googleId", // Include only relevant fields
    errorMessages: {
      UserExistsError: "A user with the given username is already registered.",
    },
  });
module.exports = mongoose.model("User", userSchema);