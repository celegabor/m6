import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import NavbarElement from '../components/navbar/navbar';
import FooterElement from '../components/footer/Footer';
import Spinner from 'react-bootstrap/Spinner';
import { Navigate, useNavigate } from 'react-router-dom'; 

import './add.css'



import './modificaPost.css'

const AddUser = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    lastName: '',
    avatar: '',
    dob: '',
    email: '',
    password: ''
  });
  const [isSuccessful, setIsSuccessful] = useState(false);

  const navigate = useNavigate();


  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const dobAsNumber = parseInt(userData.dob);

    // controllo vari errori
    if (isNaN(dobAsNumber) || userData.name.length < 3 || userData.lastName.length < 3 || userData.password.length < 4 || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) {
      setMessage('Si sono verificati errori nei campi del modulo. Si prega di controllare i dati inseriti.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return; 
    }
    setIsLoading(true); 

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...userData,
            dob: dobAsNumber,
            
          }),
      });

      if (response.ok) {
        setUserData({
          name: '',
          lastName: '',
          avatar: '',
          dob: '',
          email: '',
          password: ''
        });
        setMessage('Complimenti!!! Utente creato correttamente !!!! Adesso devi fare il login nuovamente...');
        setTimeout(() => {
          setMessage('');
          setIsSuccessful(true);
          navigate('/home')
        }, 3000);
       
      } else {
        setMessage('Mi dispiace.... Il caricamento NON è andato a buon fine !!!!!');
        setTimeout(() => {
          setMessage('');
          setIsSuccessful(true); 
        }, 3000);

        setIsSuccessful(true); 
      }

      setTimeout(() => {
        setIsLoading(false); 
      }, 1300);


    } catch (error) {
        setMessage('Mi dispiace.... Il caricamento NON è andato a buon fine !!!!!', error);
        setTimeout(() => {
          setMessage('');
        }, 4000);
    }
  };

  return (

    <>
      {isLoading ? (
          // spinner
            <div className="spinner-container">
            <Spinner animation="border" role="status">
              <span className="sr-only"></span>
            </Spinner>
            <p>Caricamento...</p>
        </div>
  
      ) : isSuccessful ? ( // Se isSuccessful è true, reindirizza l'utente
      <Navigate to="/" />
      ) : (
        <>
          <nav>
            <NavbarElement/>
          </nav>
              
          <main className='add-main'>
            <h2>Aggiungi Utente</h2>
            <Form noValidate className='form-body-user'>

              {/* name */}
              <Form.Group className='elementsForm' as={Col} controlId="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  placeholder="Nome"
                  value={userData.name}
                  onChange={handleChange}
                />
                {userData.name.length < 3 && userData.name.length > 0 && (
                  <div className="error-message">Il nome deve essere lungo almeno 3 caratteri.</div>
                )}
              </Form.Group>

    
              {/* lastname */}
              <Form.Group className='elementsForm' as={Col} controlId="lastName">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="lastName"
                  placeholder="Cognome"
                  value={userData.lastName}
                  onChange={handleChange}
                />
                {userData.lastName.length < 3 && userData.lastName.length > 0 && (
                  <div className="error-message">Il cognome deve essere lungo almeno 3 caratteri.</div>
                )}
              </Form.Group>
    
              {/* avatar */}
              <Form.Group className='elementsForm' as={Col} controlId="avatar">
                <Form.Label>link di internet di un avatar</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="avatar"
                  placeholder="Link URL del tuo Avatar"
                  value={userData.avatar}
                  onChange={handleChange}
                />
              </Form.Group>
    
              {/* dob */}
              <Form.Group className='elementsForm' as={Col} controlId="dob">
                <Form.Label>Data di Nascita</Form.Label>
                <Form.Control
                  required
                  type="date"
                  name="dob"
                  placeholder="giorno del compleanno"
                  value={userData.dob}
                  onChange={handleChange}
                />
                {isNaN(Date.parse(userData.dob)) && userData.dob.trim() !== '' && (
                  <div className="error-message">Inserire una data di nascita valida.</div>
                )}
              </Form.Group>
    
              {/* email */}
              <Form.Group className='elementsForm' as={Col} controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleChange}
                />
                {!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(userData.email) && (
                  <div className="error-message">Inserire un indirizzo email valido.</div>
                )}
              </Form.Group>

              {/* password */}
              <Form.Group className='elementsForm' as={Col} controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleChange}
                />
                {userData.password.length < 4 && userData.password.length > 0 && (
                  <div className="error-message">La password deve essere lunga almeno 4 caratteri.</div>
                )}
              </Form.Group>
    
              <Button className='buttonAddComment' type="submit" onClick={handleSubmit}>
                Aggiungi Utente
              </Button>
              <div className="message-container">
                    {message && <div className={message.includes('NON') ? 'NOT-success-message-put' : 'success-message-put-user'}>{message}</div>}
                  </div>
            </Form>
          </main>
    
          <footer>
            <FooterElement/>
          </footer>
        </>
      )}
    </>

  );
};

export default AddUser;
