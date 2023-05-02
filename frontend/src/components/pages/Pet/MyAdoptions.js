import {useState, useEffect} from 'react';

// utils
import api from '../../../utils/api';

// Css
import styles from './Dashboard.module.css';

const MyAdoptions = () => {

    const [pets, setPets] = useState([]);

    const [token] = useState(localStorage.getItem('token') || '');

    useEffect(() => {

        api.get("/pets/myadoptions", {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`
          }
            
        }).then((response) => {
            setPets(response.data);
        })

    },[token]);

    console.log(pets);

  return (
    <section>
      <div className={styles.petlist_header}>
        <h1>Minhas Adoções</h1>
      </div>
      <div className={styles.petlist_container}>
        {pets.length > 0 && 
          pets.map((pet) => (
            <div key={pet._id} className={styles.petList_row}>
                  <img
                    src={`${process.env.REACT_APP_API}public/images/pets/${pet.images[0]}`}
                    alt={pet.name}
                    className={styles.px75}
                  />
                  <span className='bold'>{pet.name}</span>
                  <div className={styles.contacts}>
                    <p>
                      <span className='bold'>Ligue para:</span> {pet.user.phone}
                    </p>
                    <p>
                      <span className='bold'>Nome:</span> {pet.user.name}
                    </p>
                  </div>
                  <div className={styles.actions}>
                    {pet.available ? (
                      <p>Adoção em processo</p>
                    ) : (
                      <p>Parabéns por concluir a adoção</p>
                    ) }
                  </div>
                </div>
          ))
        }
        {pets.length === 0 && (
          <p>Ainda não há adoções de pets</p>
        )}
      </div>
    </section>
  )
}

export default MyAdoptions