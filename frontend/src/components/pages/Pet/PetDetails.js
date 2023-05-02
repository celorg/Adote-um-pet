// Utils
import api from "../../../utils/api";

// Imports
import {useState, useEffect} from 'react'
import { useParams,Link } from "react-router-dom";

// CSS
import styles from './PetDetails.module.css';

// Hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

const PetDetails = () => {

    const {id} = useParams();
    const [token] = useState(localStorage.getItem("token") || '');
    const {setFlashMessage} = useFlashMessage();

    const [pet, setPet] = useState({});

    useEffect(() => {
        api.get(`/pets/${id}`).then((response) => {
            setPet(response.data)
        })
    },[id])


    async function schedule(){

        let msgType = 'success';

        const data = await api.patch(`/pets/schedule/${pet._id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            return response.data.message
        }).catch((err) => {
            msgType = 'error'
            return err.response.data.errors[0]
        })

        setFlashMessage(data, msgType);

    }

  return (
    <>
        {pet.name && (
            <section className={styles.pet_details_container}>
                <div className={styles.pet_details_header}>
                    <h1>Conhecendo o Pet: {pet.name}</h1>
                    <p>Se tiver interesse, marque uma visita para conhecê-lo</p>
                </div>
                <div className={styles.pet_images}>
                    {pet.images.map((image, index) => (
                        <img 
                            src={`${process.env.REACT_APP_API}public/images/pets/${image}`}
                            alt={pet.name}
                            key={index}
                        />
                    ))}
                </div>
                <p>
                    <span className='bold'>Peso:</span>
                    {pet.weight}
                </p>
                <p>
                    <span className='bold'>Anos:</span>
                    {pet.age}
                </p>
                {token ? (
                    <button onClick={schedule}>Solicitar uma visita</button>
                ) : 
                (
                    <p>Você precisa <Link to="/register">criar uma conta</Link> para solicitar a visita!</p>
                )}
            </section>
        )}
    </>
  )
}

export default PetDetails