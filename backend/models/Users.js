const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, required: true, unique: true
    },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }

})

userSchema.plugin(AutoIncrement, { inc_field: 'customId' });

module.exports = mongoose.model("User", userSchema)
