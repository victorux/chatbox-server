const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 1,
        max: 20,
    },
    lastName: {
        type: String,
        required: true,
        min: 1,
        max: 20,
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type:String,
        required: true,
        min: 6,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, 
{ timestamps: true});

module.exports = mongoose.model("User", UserSchema);