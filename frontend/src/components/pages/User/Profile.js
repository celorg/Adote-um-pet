import api from '../../../utils/api';

// CSS
import styles from './Profile.module.css';
import formStyles from '../../form/Form.module.css';

// hooks
import {useState, useEffect} from 'react';

// Form
import Input from '../../form/InputForm';

import useFlashMessage from '../../../hooks/useFlashMessage';
import RoundedImage from '../../layout/RoundedImage';

const uploads = "http://localhost:5000/images";

const Profile = () => {

    const [user, setUser] = useState({});
    const [preview, setPreview] = useState()
    const [token] = useState(localStorage.getItem("token") || '');
    const {setFlashMessage} = useFlashMessage();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [image, setImage] = useState();

    useEffect(() => {

        api.get("/users/checkuser", {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setUser(response.data)
            setName(response.data.name)
            setEmail(response.data.email)
            setPhone(response.data.phone)
        }).catch((err) => {
            return err.response.data.errors[0]
        })

    }, [token])

    function onFileChange(e){
        setPreview(e.target.files[0])
        setUser({...user, [e.target.name]: e.target.files[0]})
    }

    function handleChange(e){
        setUser({...user, [e.target.name]: e.target.value})
    }

    async function handleSubmit(e) {
        e.preventDefault();

        let msgType = 'success';

        const formData = new FormData();

        if(user.name && user.name !== name){
            formData.append("name", user.name)
        }

        if(user.email && user.email !== email){
            formData.append("email", user.email)
        }

        if(user.phone && user.phone !== phone){
            formData.append("phone", user.phone)
        }

        if(user.password){
            formData.append("password", user.password)
        }

        if(user.confirmPassword){
            formData.append("confirmPassword", user.confirmPassword)
        }

        if(user.image){
            formData.append("image", user.image)
        }

        const data = await api.patch(`/users/edit/${user._id}`, formData,{
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            msgType = "error"
            // console.log(err.response)
            return error.response.data.errors[0]
        });

        if(msgType === 'error'){
            setFlashMessage(data, msgType);
        
        }else if(msgType === 'success'){
            setFlashMessage(data.message, msgType);
        }
    }



  return (
    <section>
        <div className={styles.profile_header}>
            <h1>Perfil</h1>
            {(user.image || preview) && (
                <img 
                    src={preview ? URL.createObjectURL(preview) : `${process.env.REACT_APP_API}public/images/users/${user.image}`}
                    alt={user.name}
                    className={styles.rounded_image}
                />
            )}
        </div>
        <form onSubmit={handleSubmit} className={formStyles.form_container}>
            <Input 
                text="Imagem"
                type="file"
                name="image"
                handleOnChange={onFileChange}
            />
            <Input 
                text="Email"
                type="email"
                name="email"
                placeholder="Digite o seu e-mail"
                handleOnChange={handleChange}
                value={user.email || ''}
            />
            <Input 
                text="Nome"
                type="name"
                name="name"
                placeholder="Digite o seu Nome"
                handleOnChange={handleChange}
                value={user.name || ''}
            />
            <Input 
                text="Telefone"
                type="text"
                name="phone"
                placeholder="Digite o telefone"
                handleOnChange={handleChange}
                value={user.phone || ''}
            />
            <Input 
                text="Senha"
                type="password"
                name="password"
                placeholder="Digite a sua senha"
                handleOnChange={handleChange}
            />
            <Input 
                text="Confirmação de senha"
                type="password"
                name="confirmPassword"
                handleOnChange={handleChange}
                placeholder="Confirme a sua senha"
            />
            <input type="submit" value="Atualizar" />
        </form>
    </section>
  )
}

export default Profile