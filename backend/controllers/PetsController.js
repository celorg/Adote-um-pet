const Pet = require("../models/Pet");

// Helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;

const create = async(req,res) => {
    
    const {name, age, weight, color} = req.body;

    const available = true

    // Uploads
    const images = req.files;

    // Get pet owner
    const token = await getToken(req);
    const user = await getUserByToken(token);

    // Create
    const pet = await new Pet({
        name,
        age,
        weight,
        color,
        available,
        images: [],
        user: {
            _id: user._id,
            name: user.name,
            image: user.image,
            phone: user.phone
        }
    })

    images.map((image) => {
        pet.images.push(image.filename)
    })

    try{

        const newPet = await pet.save();

        res.status(201).json({
            message: "Pet cadastrado com sucesso",
            newPet,
        })
    
    }catch(error){
        res.status(500).json({errors: ["Por favor tente mais tarde"]})
    }


}

const getAll = async(req,res) => {

    const pets = await Pet.find({available: true}).sort("-createdAt");

    res.status(200).json(pets);

}

const getAllUserPets = async(req,res) => {

    // get users
    const token = await getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({'user._id': user._id}).sort("-createdAt");

    res.status(200).json(pets);

}

const getAllUserAdoption = async(req,res) => {

    const token = await getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({"adopter._id": user._id}).sort("-createdAt");

    res.status(200).json(pets);

}

const getPetById = async(req,res) => {

    const {id} = req.params;

    if(!ObjectId.isValid(id)){
        res.status(422).json({errors: ["ID inválido!"]})
        return;
    }

    const pet = await Pet.findOne({_id: id})

    if(!pet){
        res.status(404).json({
            errors: ["O pet não foi encontrado"]
        })
        return;
    }

    res.status(200).json(pet);

}

const removePetById = async(req,res) => {
    const {id} = req.params;

    // Check if id is valid
    if(!ObjectId.isValid(id)){
        res.status(422).json({error: ["ID inválido!!"]})
        return;
    }

    const pet = await Pet.findOne({_id: id})

    if(!pet){
        res.status(404).json({
            errors: ["O pet não foi encontrado"]
        })
        return;
    }

    // Check if logged inuser registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if(pet.user._id.toString() !== user._id.toString()){
        res.status(422).json({error: ["Houve um problema em processar a sua solicitação, tente novamente mais tarde!!"]})
        return;
    }

    await Pet.findByIdAndRemove(id);

    res.status(200).json({message: "Removido com sucesso"});
    
}

const updatePet = async(req,res) => {

    const {id} = req.params;

    const {name, age, weight, color, available} = req.body;

    let images = null

    if(req.files){
        images = req.files;
    }

    const updatedData = {}

    // Check if pet exists
    const pet = await Pet.findOne({_id: id})

    if(!pet){
        res.status(404).json({errors: ["O pet não encontrado!"]})
        return;
    }

    const token = await getToken(req);
    const user = await getUserByToken(token);

    if(pet.user._id.toString() !== user._id.toString()){
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde!!"]});
        return;
    }

    if(name){
        updatedData.name = name;
    }

    if(age){
        updatedData.age = age;
    }

    if(weight){
        updatedData.weight = weight
    }

    if(color){
        updatedData.color = color
    }

    if(available){
        updatedData.available = available
    }

    if(images.length > 0){
        updatedData.images = [];
        images.map((image) => {
            updatedData.images.push(image.filename);
        })
    }

    const petUpdate = await Pet.findByIdAndUpdate(id, updatedData);

    res.status(200).json(
        {
            message: "Pet atualizado com sucesso!",
            pet: petUpdate,
        });

}

const schedule = async(req, res) => {

    const {id} = req.params;

    // Check if pet exists
    try{

        const pet = await Pet.findOne({_id: id});
    
        if(!pet){
            res.status(404).json({
                errors: ["Pet não encontrado"]
            });
            return;
        }

        // check if user registered the pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.equals(user._id)){
            res.status(422).json({errors: ["Você não pode agendar um visita com seu proprio pet"]})
            return;
        }

        // Check if user has already scheduled a visit
        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({errors: ["Você já agendou uma visita para este Pet!"]})
                return;
            }
        }

        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name}, pelo telefone ${pet.user.phone}`
        });


    }catch(error){
        res.status(404).json({
            errors: ["Pet não encontrado"]
        });
    }
    
}

const concludeAdoption = async(req,res) => {
    
    const {id} = req.params

    try{
        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({errors: ["Pet não encontrado"]})
            return;
        }

        // Check if logged in user registered the pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({
                errors: ["Houve um problema em processar a sua solicitação"]
            })
            return;
        }

        pet.available = false;

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({message: "Parabéns! O clico de adoção foi finalizado com sucesso"})
    
    }catch(error){
        res.status(404).json({errors: ["Pet não encontrado"]})
        return;
    }

}

module.exports = {
    create,
    getAll,
    getAllUserPets,
    getAllUserAdoption,
    getPetById,
    removePetById,
    updatePet,
    schedule,
    concludeAdoption,
}