const {body} = require("express-validator");
const User = require("../models/User");

const createUserValidation = () => {
    return [
        body("name")
        .isString().withMessage("O nome é obrigatório")
        .isLength({min: 3}).withMessage("O nome deve ter no mínimo 3 caracteres"),
        body("email")
            .isString().withMessage("O email é obrigatório")
            .isEmail().withMessage("Insira um email válido")
            .custom(value => {
                return User.findOne({email: value}).then(user => {
                    if(user){
                        return Promise.reject("Email já esta cadastrado")
                    }
                    
                })
            }),
        body("phone")
            .isString().withMessage("O telefone é obrigatório")
            .isLength({min: 10}).withMessage("Insira um telefone válido"),
        body("password")
            .isString().withMessage("A senha é obrigatória")
            .isLength({min: 6}).withMessage("A senha deve ter no mínimo 6 caracteres"),
        body("confirmPassword")
            .isString().withMessage("A confirmação de senha é obrigatória")
            .custom((value, {req}) => {
                if(value != req.body.password){
                    throw new Error("As senhas devem ser iguais")
                }
                return true
            })
    ]
    
}

const loginValidation = () => {
    return [
        body("email")
            .isString().withMessage("O email é obrigatório")
            .isEmail().withMessage("Insira um email válido"),
        body("password")
            .isString().withMessage("A senha é obrigatória")
    ]
}

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({min:3})
            .withMessage("O nome precisa de pelo menos 3 caracteres"),
        body("email")
            .optional()
            .isEmail().withMessage("Insira um email válido")
            .custom(value => {
                return User.findOne({email: value}).then((user) => {
                    if(user){
                        return Promise.reject("Email já existe")
                    }
                })
            }),
        body("phone")
            .optional()
            .isString().withMessage("O telefone é obrigatório")
            .isLength({min: 10}).withMessage("Insira um telefone válido"),
        body("password")
            .optional()
            .isLength({min:6})
            .withMessage("A senha precisa ter no mínimo 6 caracteres"),
        body("confirmPassword")
            .optional()
            .custom((value, {req}) => {
                if(value !== req.body.password){
                    throw new Error("As senhas devem ser iguais!")
                }
                return true;
            })
    ]
}

module.exports = {
    createUserValidation,
    loginValidation,
    userUpdateValidation,
}