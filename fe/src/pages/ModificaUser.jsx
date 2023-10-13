import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavbarElement from '../components/navbar/navbar';
import FooterElement from '../components/footer/Footer';
import Spinner from 'react-bootstrap/Spinner';


const ModificaUser = () => {

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();  
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    lastName: '',
    avatar: '',
    dob: null,
    email: '',
  });

  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true); 

      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/get/${id}`);
        const data = await response.json();

        setUserData({
          name: data.user.name,
          lastName: data.user.lastName,
          avatar: data.user.avatar,
          dob: data.user.dob,
          email: data.user.email
        }); 
        setTimeout(() => {
          setIsLoading(false); 
        }, 300);


      } catch (error) {
        console.error('Errore nella fetch dei dati del post:', error);
      }
    };

    fetchPostData();
  }, [id]);

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    setIsLoading(true); 


    try {
      
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/put/${id}`, {
        method: 'PUT',
        headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        setMessage('Mi dispiace.... Il caricamento NON è andato a buon fine !!!!!');
        setTimeout(() => {
          setMessage('');
        }, 4000);
      } else {

        setMessage('Complimenti!!! Il caricamento è andato a buon fine !!!!!');
        setTimeout(() => {
          setMessage('');
        }, 4000);
      }
      setTimeout(() => {
        setIsLoading(false); 
      }, 300);


    } catch (error) {
      setMessage('Mi dispiace.... Il caricamento NON è andato a buon fine !!!!!');
      setTimeout(() => {
        setMessage('');
      }, 4000);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
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
    
        {/* bottone home */}
          <div className="button-confirm-container">
            <Link to={`/home`}>
              <Button className='px-5 py-2 m-3' variant='success'>Home</Button>
            </Link>
          </div>
    
          <main className='main'>
            <div className='w-50'>
              <h2>Modifica ----USER----</h2>
              <Form noValidate className='form-body-user'>
                  <h4>Compila il form con le tue modifiche...</h4>
    
                  {/* name */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustom02">
                    <Form.Label>name</Form.Label>
                      <Form.Control
                          required
                          type="text"
                          name="name"
                          placeholder="name"
                          value={userData.name}
                          onChange={handleChange}
                      />
                    <Form.Control.Feedback>name valido!</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* lastName */}
                  <Form.Group className='elementsForm menu-selector-class' as={Col} controlId="validationCustomvalue">
                    <Form.Label>lastName</Form.Label>
                      <Form.Control
                          required
                          type="text"
                          name="lastName"
                          placeholder="lastName"
                          value={userData.lastName}
                          onChange={handleChange}
                      />
                    <Form.Control.Feedback>category valida!</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* avatar */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustomUsername">
                    <Form.Label>avatar</Form.Label>
                      <Form.Control
                        type="text"
                        name="avatar"
                        placeholder="avatar"
                        required
                        value={userData.avatar}
                        onChange={handleChange}
                      />
                    <Form.Control.Feedback>avatar valida!</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* dob */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustomUsername">
                    <Form.Label>dob</Form.Label>
                      <Form.Control
                        type="text"
                        name="dob"
                        placeholder="dob"
                        required
                        value={userData.dob}
                        onChange={handleChange}
                      />
                    <Form.Control.Feedback>dob valida!</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* email */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustomUsername">
                    <Form.Label>email</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        placeholder="email"
                        required
                        value={userData.email}
                        onChange={handleChange}
                      />
                    <Form.Control.Feedback>email valida!</Form.Control.Feedback>
                  </Form.Group>
    
                  
    
                  <div className="message-container">
                    {message && <div className={message.includes('NON') ? 'NOT-success-message-put' : 'success-message-put'}>{message}</div>}
                  </div>
    
                  <Button className='m-4 w-50 buttonAddComment' type="submit" onClick={handleSubmit}>
                      Invia!
                  </Button>
                  
              </Form>
            </div>
            <div className="preview-section">
              <h4>Anteprima delle modifiche</h4>
              {userData.avatar && (
                <div className="avatar-preview">
                  <img src={userData.avatar} alt="Avatar Preview" />
                </div>
              )}
              <p>Nome: {userData.name}</p>
              <p>Cognome: {userData.lastName}</p>
              <p>Email: {userData.email}</p>
              <p>Data di nascita: {userData.dob}</p>
            </div>
          </main>
    
          <footer>
            <FooterElement/>
          </footer>
        </>

      )}
    </>
  );
};

export default ModificaUser;