const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    gender: String,
    freinds: [],
    freindRequestSent: [],
    freindRequestReceived: []
})
module.exports = new mongoose.model("demoUser", userSchema);