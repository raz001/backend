const mongoose = require("mongoose");

const postSChema = mongoose.Schema({
    title: String,
    body: String,
    device: String,
    no_of_comments: Number,
    userID: String,
    user: String
}, {
    versionKey: false
});

const PostModel = mongoose.model("post", postSChema);
module.exports = { PostModel }