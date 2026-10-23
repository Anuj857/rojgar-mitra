const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    role: String,
    location: String
});

module.exports = mongoose.model("User", userSchema);