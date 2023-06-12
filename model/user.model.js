const mongoose = require("mongoose");

const userSChema = mongoose.Schema({
    name: String,
    email: String,
    gender: String,
    password: String,
    age: Number,
    city: String,
    is_married: Boolean
}, {
    versionKey: false
});

const UserModel = mongoose.model("user", userSChema);
module.exports = { UserModel }