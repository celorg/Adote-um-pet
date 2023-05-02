const router = require("express").Router();

// constrolllers
const {
    create,
    getAll,
    getAllUserPets,
    getAllUserAdoption,
    getPetById,
    removePetById,
    updatePet,
    schedule,
    concludeAdoption,
} = require("../controllers/PetsController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const checkToken = require("../middlewares/verifyToken");
const { 
    createPetValidation,
    updatePetValidations
} = require("../middlewares/petValidations")

//helpers
const {imageUpload} = require("../helpers/image-upload");

// Rotas
router.post("/create", checkToken, imageUpload.array("images"), createPetValidation(), validate ,create);
router.get("/", getAll);
router.get("/mypets", checkToken, getAllUserPets);
router.get("/myadoptions", checkToken, getAllUserAdoption);
router.get("/:id", getPetById);
router.delete("/:id", checkToken, removePetById);
router.patch("/:id", checkToken, imageUpload.array('images') , updatePetValidations(), validate, updatePet);
router.patch("/schedule/:id", checkToken, schedule);
router.patch("/conclude/:id", checkToken, concludeAdoption);


module.exports = router;