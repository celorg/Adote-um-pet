import React, { useContext } from 'react';
import {Link} from 'react-router-dom';

import styles from './Navbar.module.css';

// Context
import { Context } from '../../context/UserContext';


const Navbar = () => {

    const { authenticated ,logout} = useContext(Context);

  return (
    <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
            <h1>Adote seu Pet</h1>
        </Link>
        <ul >
            <li>
                <Link to="/">Adotar</Link>
            </li>
            {authenticated === true ? (
                <>
                    <li>
                        <Link to="/pet/myadoptions">Minhas Adoções</Link>
                    </li>
                    <li>
                        <Link to="/pet/mypets">Meus Pets</Link>
                    </li>
                    <li>
                        <Link to="/user/profile">Perfil</Link>
                    </li>
                     <li onClick={logout}>Sair</li>
                </>
               
            ):(
                <>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Cadastrar</Link>
                    </li>
                </>
            )}
            
        </ul>
    </nav>
  )
}

export default Navbar