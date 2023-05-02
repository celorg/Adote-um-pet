import { createContext } from "react";

import useAuth from "../hooks/useAuth";

const Context = createContext();

function UserProvider({children}){

    const {register,logout,login, authenticated} = useAuth();

    return (
        <Context.Provider value={{register,logout, login, authenticated}}>
            {children}
        </Context.Provider>
    )
}

export {Context, UserProvider}