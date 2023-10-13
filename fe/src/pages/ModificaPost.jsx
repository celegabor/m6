import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavbarElement from '../components/navbar/navbar';
import FooterElement from '../components/footer/Footer';
import Spinner from 'react-bootstrap/Spinner';



import './modificaPost.css'



const ModificaPost = () => {

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();  
  const [message, setMessage] = useState('');
  const [postData, setPostData] = useState({
    category:'',
    cover:'',
    title: '',
    author:'',
    readTime:{
      valore: null,
      unit:''
    }
  });

  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true); 

      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/get/${id}`);
        const data = await response.json();

        setPostData({
          author: data.post.author,
          category: data.post.category,
          cover: data.post.cover,
          title: data.post.title,
          readTime:{
            value: data.post.readTime.value,
            unit: data.post.readTime.unit
          }
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
      
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/put/${id}`, {
        method: 'PUT',
        headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify(postData),
      });
      console.log(postData);

      if (!response.ok) {
        setMessage('Mi dispiace.... Il caricamento NON è andato a buon fine !!!!!');
        setTimeout(() => {
          setMessage('');
        }, 2500);
      } else {
        console.log('modificato');

        setMessage('Complimenti!!! Il caricamento è andato a buon fine !!!!!');
        setTimeout(() => {
          setMessage('');
        }, 2500);
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
     if (name.startsWith('readTime.')) {
      const readTimeField = name.split('.')[1]; 
      setPostData((prevData) => ({
        ...prevData,
        readTime: {
          ...prevData.readTime,
          [readTimeField]: value,
        },
      }));
    } else {
      setPostData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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
          
          {/* bottone home */}
          <div className="button-confirm-container">
            <Link to={`/home`}>
              <Button className='px-5 py-2 m-3' variant='success'>Home</Button>
            </Link>
          </div>
    
          <main className='main'>
            <div className='w-50'>
              <h2>Modifica ----POST----</h2>
              <Form noValidate className='form-body-post'>
                  <h4>Compila il form con le tue modifiche...</h4>
                  
                  {/* author avatar */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustomUsername">
                    <Form.Label>author</Form.Label>
                      <Form.Control
                        type="text"
                        name="author"
                        placeholder="author id"
                        required
                        value={postData.author}
                        onChange={handleChange}
                      />
                    <Form.Control.Feedback>Author AVATAR valida!</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* title */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustom02">
                    <Form.Label>title</Form.Label>
                      <Form.Control
                          required
                          type="text"
                          name="title"
                          placeholder="title"
                          value={postData.title}
                          onChange={handleChange}
                      />
                    <Form.Control.Feedback>title valido!</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* category */}
                  <Form.Group className='elementsForm menu-selector-class' as={Col} controlId="validationCustomvalue">
                    <Form.Label>category</Form.Label>
                      <Form.Control
                          required
                          type="text"
                          name="category"
                          placeholder="category"
                          value={postData.category}
                          onChange={handleChange}
                      />
                    <Form.Control.Feedback>category valida!</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* cover */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustomUsername">
                    <Form.Label>cover</Form.Label>
                      <Form.Control
                        type="text"
                        name="cover"
                        placeholder="cover"
                        required
                        value={postData.cover}
                        onChange={handleChange}
                      />
                    <Form.Control.Feedback>cover valida!</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* readtime value */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustomUsername">
                    <Form.Label>valore</Form.Label>
                      <Form.Control
                        type="number"
                        name="readTime.value"
                        placeholder="value"
                        required
                        value={postData.readTime.value}
                        onChange={handleChange}
                      />
                    <Form.Control.Feedback>readTime valore valida</Form.Control.Feedback>
                  </Form.Group>
    
                  {/* readtime unit */}
                  <Form.Group className='elementsForm' as={Col} controlId="validationCustomUsername">
                    <Form.Label>unit</Form.Label>
                      <Form.Control
                        type="text"
                        name="readTime.unit"
                        placeholder="unit"
                        required
                        value={postData.readTime.unit}
                        onChange={handleChange}
                      />
                    <Form.Control.Feedback>readTime unit valida</Form.Control.Feedback>
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
                <h3>Anteprima delle modifiche</h3>
                {postData.author.avatar && (
                  <div className="avatar-preview">
                    <h4>Avatar Autore</h4>
                    <img src={postData.author.avatar} alt="Avatar Autore" />
                  </div>
                )}
                {postData.cover && (
                  <i className="avatar-cover mb-4">
                    <img src={postData.cover} alt="Avatar cover" />
                  </i>
                )}
                <p>Titile: {postData.title}</p>
                <p>Category: {postData.category}</p>
                <p>Valore: {postData.readTime.value}</p>
                <p>Unit: {postData.readTime.unit}</p>
                <p>ID autore: {postData.author}</p>
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

export default ModificaPost;