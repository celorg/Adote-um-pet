const router = require("express").Router();

router.use("/users", require("./UserRoutes"));

router.use("/pets", require("./PetsRoutes"));

router.get("/", (req,res) => {
    res.send("Bem-vindo")
})

module.exports = router