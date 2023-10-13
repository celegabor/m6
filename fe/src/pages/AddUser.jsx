import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import NavbarElement from '../components/navbar/navbar';
import FooterElement from '../components/footer/Footer';
import Spinner from 'react-bootstrap/Spinner';
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

    if (isNaN(dobAsNumber)) {
        setMessage('La data di nascita deve essere un numero valido');
        setTimeout(() => {
        setMessage('');
        }, 4000);
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
        setMessage('Complimenti!!! Il caricamento è andato a buon fine !!!!!');
        setTimeout(() => {
          setMessage('');
        }, 2500);
        
      } else {
        setMessage('Mi dispiace.... Il caricamento NON è andato a buon fine !!!!!');
        setTimeout(() => {
          setMessage('');
        }, 2500);
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
  
      ) : (
        <>
          <nav>
            <NavbarElement/>
          </nav>
          
          {/* Bottone Home */}
          <div className="button-confirm-container">
            <Link to={`/home`}>
              <Button className='px-5 py-2 m-3' variant='success'>Home</Button>
            </Link>
          </div>
    
          <main className='add-main'>
            <h2>Aggiungi Utente</h2>
            <Form noValidate className='form-body-user'>
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
              </Form.Group>
    
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
              </Form.Group>
    
              <Form.Group className='elementsForm' as={Col} controlId="avatar">
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  type="text"
                  name="avatar"
                  placeholder="URL dell'Avatar"
                  value={userData.avatar}
                  onChange={handleChange}
                />
              </Form.Group>
    
              <Form.Group className='elementsForm' as={Col} controlId="dob">
                <Form.Label>Data di Nascita</Form.Label>
                <Form.Control
                  type= "text"
                  name="dob"
                  placeholder="giorno del compleanno"
                  value={userData.dob}
                  onChange={handleChange}
                />
              </Form.Group>
    
              <Form.Group className='elementsForm' as={Col} controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className='elementsForm' as={Col} controlId="password">
                <Form.Label>password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="password"
                  value={userData.password}
                  onChange={handleChange}
                />
              </Form.Group>
    
              <Button className='buttonAddComment' type="submit" onClick={handleSubmit}>
                Aggiungi Utente
              </Button>
              <div className="message-container">
                    {message && <div className={message.includes('NON') ? 'NOT-success-message-put' : 'success-message-put'}>{message}</div>}
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
