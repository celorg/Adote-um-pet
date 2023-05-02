import {BrowserRouter, Routes, Route} from 'react-router-dom'
import React, { Suspense } from 'react';

// Context
import {UserProvider} from './context/UserContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
import Message from './components/layout/Message';

// Pages
const Home = React.lazy(() => import("./components/pages/Home"));
const Login = React.lazy(() => import("./components/pages/Auth/Login"));
const Register = React.lazy(() => import("./components/pages/Auth/Register"));
const Profile = React.lazy(() => import("./components/pages/User/Profile"));
const MyPets = React.lazy(() => import("./components/pages/Pet/MyPets"));
const AddPet = React.lazy(() => import("./components/pages/Pet/AddPet"));
const EditPet = React.lazy(() => import("./components/pages/Pet/EditPet"));
const PetDatails = React.lazy(() => import("./components/pages/Pet/PetDetails"));
const MyAdoptions = React.lazy(() => import("./components/pages/Pet/MyAdoptions"));

function App() {
  return (
      <BrowserRouter>
        <Suspense fallback={<div className='suspense'>Carregando...</div>}>
          <UserProvider>
            <Navbar />
            <Message />
            <Container >
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/user/profile' element={<Profile />} />
                <Route path='/pet/mypets' element={<MyPets />} />
                <Route path='/pet/add' element={<AddPet />} />
                <Route path='/pet/edit/:id' element={<EditPet />} />
                <Route path='/pet/:id' element={<PetDatails />} />
                <Route path='/pet/myadoptions' element={<MyAdoptions />} />
              </Routes>
            </Container>
            <Footer />
          </UserProvider>
        </Suspense>
      </BrowserRouter>
  );
}

export default App;
