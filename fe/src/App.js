import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Other from './pages/Other'
import ModificaPost from './pages/ModificaPost'
import ModificaUser from './pages/ModificaUser'
import AddUser from './pages/AddUser'
import AddPost from './pages/AddPost'
import Success from './pages/Success'
import SuccessGoogle from './pages/SuccessGoogle'
import Login from './pages/Login'
import ProtectedRouts from './middlewares/ProtectedRoutes';


const App = ()=>{
  return(
    <BrowserRouter>
      <Routes>

        <Route exact path="/" element={<Login />}/>
        <Route path="/addUser" element={<AddUser />}/>
        <Route path="/success/:token" element={<Success />}/>
        <Route path="/successgoogle/:code" element={<SuccessGoogle />}/>
        <Route element={<ProtectedRouts/>}>

          <Route path="/addPost" element={<AddPost />}/>
          <Route path="/modificaPost/:id" element={<ModificaPost />}/>
          <Route path="/modificaUser/:id" element={<ModificaUser />}/>
          <Route path="/home" element={<Home />}/>

        </Route>

        <Route path="*" element={<Other />}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App;
