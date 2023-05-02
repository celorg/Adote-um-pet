const router = require("express").Router();

//Controller
const {
    register,
    login,
    checkUser,
    getUserById,
    update,
} = require("../controllers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const {
    createUserValidation,
    loginValidation,
    userUpdateValidation
} = require("../middlewares/userValidations");

// Helpers
const {imageUpload} = require("../helpers/image-upload");

const checkToken = require("../middlewares/verifyToken");


// Routes
router.post("/register",createUserValidation(),validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/checkuser", validate,checkUser);
router.get("/:id", getUserById);
router.patch("/edit/:id", checkToken , imageUpload.single("image"), userUpdateValidation(), validate, update);

module.exports = router