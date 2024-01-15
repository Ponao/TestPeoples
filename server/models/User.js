const mongoose = require("../database")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String, select: false },
    birthday: { type: Date },
    sex: { type: String },

    createdAt: { type: Date, default: Date.now },
    buff: Buffer
})

const User = mongoose.model('User', UserSchema)

module.exports = User
 