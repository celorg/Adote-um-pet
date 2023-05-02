const User = require("../models/User");

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET

const bcrypt = require("bcryptjs");

// Helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token")

const register = async(req,res) => {
    const {name,email,phone,password} = req.body;

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(422).json({
            errors: ["Esse email já existe"]
        })
        return;
    }

    // Generete Password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password,salt);

    // create user
    const newUser = await User.create({
        name,
        email,
        phone,
        password: passwordHash
    })

    if(!newUser){
        res.status(404).json({
            errors: ["Houve um erro ao criar um usúario"]
        })
        return;
    }

    await createUserToken(newUser,req,res);

}

const login = async(req,res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user){
        res.status(422).json({
            errors: ["Email ou senha inválidos"]
        })
        return;
    }

    // Check if passsword matches
    if(!(await bcrypt.compare(password, user.password))){
        res.status(404).json({
            errors: ["Email ou senha inválidos"]
        })
        return;
    }

    await createUserToken(user, req, res);
}

const checkUser = async(req,res) => {
    let currentUser

    if(req.headers.authorization){

        const token = getToken(req);

        const decoded = jwt.verify(token, secret)

        currentUser = await User.findById(decoded.id).select("-password")
        

    }else {
        currentUser = null
    }

    res.status(200).json(currentUser)

}

const getUserById = async(req,res) => {
    
    const {id} = req.params

    try {

        const user = await User.findById(id).select("-password");

        if(!user){
            res.status(404).json({
                errors: ["Esse usúario não encontrado!"]
            })
            return;
        }

        res.status(200).json(user);

    }catch(error){
        res.status(404).json({
            errors: ["Esse usúario não encontrado!"]
        })
        return;
    }

}

const update = async(req,res) => {

    const {name,email,phone,password, confirmPassword} = req.body;

    const {id} = req.params;

    let profileImage = null;

    if(req.file){
        profileImage = req.file.filename
    }

    const token = await getToken(req);

    const user = await getUserByToken(token);

    if(id != user._id){
        res.status(422).json({errors: ["Por favor,tente mais tarde!"]})
        return;
    }

    if(name){
        user.name = name
    }

    if(email){
        user.email = email
    }

    if(phone){
        user.phone = phone
    }

    if(profileImage){
        user.image = profileImage
    }

    
    if(password){
        if(!confirmPassword ){
            res.status(422).json({errors: ["A confirmação de senha é obrigatória"]})
            return;
        }
        
        //Creating password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt)

        user.password = passwordHash

    }
        
    try {

        // return user update data
        const userUpdate = await User.findOneAndUpdate(
            {_id: user._id},
            {$set: user},
            {new: true},
        )
        
        res.status(200).json({
            message: "Usuário atualizado com sucesso",
            user: userUpdate,
        })

    }catch(err){
        res.status(500).json({errors: ["Erro ao fazer update"]})
        return
    }
}



    



module.exports = {
    register,
    login,
    checkUser,
    getUserById,
    update,
}