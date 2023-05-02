import api from "../../../utils/api";

import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";

// Css
import styles from './AddPet.module.css';

// Form
import PetForm from "../../form/PetForm";

// hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

const EditPet = () => {
    const [pet, setPet] = useState({});
    const [inicialPet, setInicialPet] = useState({});

    const [token] = useState(localStorage.getItem('token') || '');
    const {id} = useParams();
    const {setFlashMessage} = useFlashMessage();

    useEffect(() => {
        api.get(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setPet(response.data);
            setInicialPet(response.data);
        })
    }, [token, id]);

    console.log(inicialPet);

    async function updatedPet(pet){
        let msgType = 'success';

        const formData = new FormData();

        if(pet.name && pet.name !== inicialPet.name){
            formData.append("name", pet.name);
        }

        if(pet.age && pet.age !== inicialPet.age){
            formData.append("age", pet.age);
        }

        if(pet.weight && pet.weight !== inicialPet.weight){
            formData.append("weight", pet.weight)
        }

        if(pet.color && pet.color !== inicialPet.color){
            formData.append("color", pet.color)
        }

        if(pet.images.length > 0){
            console.log("Chegamos aqui")
            pet.images.map((image) => {
                formData.append("images", image)
            })
        }

        const data = await api.patch(`/pets/${pet._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data.message
        }).catch((err) => {
            msgType = ''
            return err.response.data.errors[0]
        });

        setFlashMessage(data, msgType);
        
    }

  return (
    <section>
        <div className={styles.addpet_header}>
            <h1>Editando o Pet: {pet.name}</h1>
            <p>Depois da edição os dados serão atualizados no sistema</p>
        </div>
        {pet.name && (
            <PetForm 
                handleSubmit={updatedPet}
                btnText="Atualizar"
                petData={pet}
            />
        )}
    </section>
  )
}

export default EditPet