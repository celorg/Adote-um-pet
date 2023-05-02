// Hooks
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// Context
import { Context } from '../../../context/UserContext';

// Css
import styles from '../../form/Form.module.css';

// Form
import Input from '../../form/InputForm';

const Login = () => {

  const [user, setUser] = useState({});
  const { login } = useContext(Context)

  function handleChange (e) {
    setUser({...user, [e.target.name]: e.target.value})
  }

  function handleSubmit(e) {
    e.preventDefault();

    login(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input 
          text='Email:'
          type="email"
          name="email"
          placeholder="Digite seu email"
          handleOnChange={handleChange}
        />
        <Input 
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite sua senha"
          handleOnChange={handleChange}
        />
        <input type='submit' value="Entrar" />
      </form>
      <p>Não tem conta? <Link to="/register">Clique aqui</Link></p>
    </section>
  )
}

export default Login