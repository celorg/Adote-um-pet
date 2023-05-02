const {body} = require("express-validator");

const createPetValidation = () => {
    return [
        body("name")
            .isString().withMessage("O nome do pet é obrigatório")
            .isLength({min: 2}).withMessage("O nome do pet deve ter no mínimo 2 caracteres"),
        body("age")
            .isString().withMessage("A idade é obrigatório")
            .isNumeric().withMessage("A idade deve ser apenas números"),
        body("weight")
            .isString().withMessage("O peso deve ser obrigatório")
            .isNumeric().withMessage("O peso deve ter apenas números"),
        body("color")
            .isString().withMessage("A cor é obrigatório")
            .isLength({min: 3}).withMessage("A cor deve ter no mínimo 3 caracteres"),
        body("images")
            .custom((value, {req}) => {
                if(!req.files){
                    throw new Error("A imagem do pet é obrigatória")
                }
                return true
            })
    ]
}

const updatePetValidations = () => {
    return [
        body("name")
            .optional()
            .isString().withMessage("O nome é obrigatório")
            .isLength({min: 2}).withMessage("O nome deve ter no mínimo 2 caracteres"),
        body("age")
            .optional()
            .isString().withMessage("A idade é obrigatória")
            .isNumeric().withMessage("A idade deve ter apenas números"),
        body("weight")
            .optional()
            .isString().withMessage("O peso é obrigatório")
            .isNumeric().withMessage("O peso deve ter apenas números"),
        body("color")
            .optional()
            .isString().withMessage("A cor deve ser obrigatória")
            .isLength({min: 3}).withMessage("A cor deve ter no mínimo 3 caracteres"),
        
    ]
}


module.exports = {
    createPetValidation,
    updatePetValidations,
}