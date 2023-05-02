import{useState} from 'react'
import {useNavigate } from 'react-router-dom';
// CSS
import styles from './AddPet.module.css';

// utils
import api from '../../../utils/api';

// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

// Form
import PetForm from '../../form/PetForm';

const AddPet = () => {

    const [token] = useState(localStorage.getItem('token') || '');
    const {setFlashMessage} = useFlashMessage();
    const navigate = useNavigate();

    async function registerPet(pet){
      let msgType = 'success';

      const formData = new FormData;

      console.log(pet)

      if(pet.images){
        pet.images.map((image) => {
          formData.append("images", image)
        })
      }

      if(pet.name){
        formData.append("name", pet.name)
      }

      if(pet.age){
        formData.append("age", pet.age)
      }

      if(pet.weight){
        formData.append("weight", pet.weight)
      }

      if(pet.color){
        formData.append("color", pet.color)
      }

      const data = await api.post("pets/create", formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        return response.data  
        
      }).catch((error) => {
        msgType = 'error'
        return error.response.data.errors[0]
      })

      if(msgType === 'success'){
        setFlashMessage(data.message, msgType)
        navigate('/pet/mypets')
      }
      if(msgType === 'error'){
        setFlashMessage(data, msgType)
      }
    }

  return (
    <section className={styles.addpet_header}>
        <div >
            <h1>Cadastre um Pet</h1>
            <p>Depois ele disponível para a adoção</p>
        </div>
        <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet"/>
    </section>
  )
}

export default AddPet