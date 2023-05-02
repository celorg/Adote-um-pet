require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const port = process.env.PORT;

const app = express();

// Config json
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Cors
app.use(cors({credentials: true, origin: "http://localhost:3000"}));

// Upload
app.use("/public", express.static(path.join(__dirname, "/public")));

// DB
require("./db/config");

// Routes
const router = require("./routes/Router");
app.use(router);

// Lister
app.listen(port, () => {
    console.log("App rodando na porta: " + port)
})