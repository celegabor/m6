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

const AddPost = () => {


  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState(null);

  const [postData, setPostData] = useState({
    category: '',
    // cover: '',
    title: '',
    author: '',
    readTime: {
      value: null,
      unit: ''
    },
    content: ''
  });

  // Recupera il token dalla memoria locale
  const token = JSON.parse(localStorage.getItem('loggedInUser'))


  const onChangeSetFile = (e) =>{
    setFile(e.target.files[0])
  }

  const uploadFile = async(cover) =>{
    const fileData = new FormData()
    fileData.append('cover', cover)

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/post/cloudUpload`, {
        headers:{
          'Authorization': token,
        },
        method: "POST",
        body: fileData
      })
      return await response.json()
    } catch (e) {
      console.log(e, 'errore upload file');
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.includes('.')) {
      const [parentField, childField] = name.split('.');
      setPostData((prevData) => ({
        ...prevData,
        [parentField]: {
          ...prevData[parentField],
          [childField]: name === 'readTime.value' ? parseInt(value) : value,
        },
      }));
    } else {
        setPostData({
            ...postData,
            [name]: name === 'readTimeValue' ? parseInt(value) : value,
          });
    }
    
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();

    const valueAsNumber = parseInt(postData.readTime.value);
    setIsLoading(true); 

    if(file){
      try {

        const uploadCover = await uploadFile(file)

        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              ...postData,
              cover: uploadCover.cover,
              readTime: {
                  ...postData.readTime,
                  value: valueAsNumber, 
                },
            }),
        });
  
        if (response.ok) {
          setTimeout(() => {
            setIsLoading(false); 
          }, 1300);
          setPostData({
            category: '',
            title: '',
            author: '',
            readTime: {
              value: null,
              unit: '',
            },
            content: ''
          });
  
          setMessage('Complimenti!!! Il caricamento è andato a buon fine !!!!!');
          setTimeout(() => {
            setMessage('');
          }, 2500)
  
        } else {
          setTimeout(() => {
            setIsLoading(false); 
          }, 1300);
          setMessage('Mi dispiace.... Il caricamento NON è andato a buon fine !!!!!');
          setTimeout(() => {
            setMessage('');
          }, 2500);
        }
      } catch (error) {
        setMessage('Mi dispiace.... Il caricamento NON è andato a buon fine !!!!!', error);
        setTimeout(() => {
          setMessage('');
        }, 4000);
      }
    } else {
      console.log('seleziona un file');
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
            <h2>Crea un Nuovo Post</h2>
            <Form className='form-body-post' encType='multipart/form-data'>
              <Form.Group className='elementsForm' as={Col} controlId="category">
                <Form.Label>Categoria</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="category"
                  placeholder="Categoria"
                  value={postData.category || ''}
                  onChange={handleChange}
                />
              </Form.Group>
    
              <Form.Group className='elementsForm' as={Col} controlId="cover">
                <Form.Label>Copertina (URL)</Form.Label>
                <Form.Control
                  type="file"
                  name="cover"
                  placeholder="URL della Copertina"
                  value={postData.cover}
                  onChange={onChangeSetFile}
                />
              </Form.Group>
    
              <Form.Group className='elementsForm' as={Col} controlId="title">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="title"
                  placeholder="Titolo"
                  value={postData.title || ''}
                  onChange={handleChange}
                />
              </Form.Group>
    
              <Form.Group className='elementsForm' as={Col} controlId="authorName">
                <Form.Label>Autore</Form.Label>
                <Form.Control
                    type="text"
                    name="author" 
                    placeholder="Id Autore"
                    value={postData.author || ''}
                    onChange={handleChange}
                />
                </Form.Group>
    
              <Form.Group className='elementsForm' as={Col} controlId="readTimeValue">
                <Form.Label>Tempo di Lettura Valore</Form.Label>
                <Form.Control
                  type="text"
                  name="readTime.value"
                  placeholder="Tempo di Lettura Valore"
                  value={postData.readTime.value || ''}
                  onChange={handleChange}
                />
              </Form.Group>
    
              <Form.Group className='elementsForm' as={Col} controlId="readTimeUnit">
                <Form.Label>Tempo di Lettura Unità</Form.Label>
                <Form.Control
                    type="text"
                    name="readTime.unit"
                    placeholder="Tempo di Lettura Unità"
                    value={postData.readTime.unit || ''} 
                    onChange={handleChange}
                />
                </Form.Group>
    
              <Form.Group className='elementsForm' as={Col}>
                <Form.Label>Content</Form.Label>
                <Form.Control
                    type="text"
                    name="content"
                    placeholder="content"
                    value={postData.content || ''} 
                    onChange={handleChange}
                />
                </Form.Group>
    
    
              <Button className='buttonAddComment' type="submit" onClick={handleSubmit}>
                Crea Post
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

export default AddPost;
