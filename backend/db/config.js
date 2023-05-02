const mongoose = require("mongoose");

const conn = mongoose.connect('mongodb://127.0.0.1:27017/pet')
    .then(() => {
        console.log("Conctado ao mongo")
    }).catch((err) => {
        console.log("Houve um erro ao se conectar com o banco: " + err)
    })

module.exports = conn;