const mongoose = require("mongoose");
const {Schema} = mongoose;

const useSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", useSchema);

module.exports = User;