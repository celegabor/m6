import { Button, Modal } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './navbar.css'

function NavScrollExample() {

  const [showConfirmation, setShowConfirmation] = useState(false);


  const navigate = useNavigate();

  const handleLogout = () => {
    // Mostra il popup di conferma
    setShowConfirmation(true);
  };

  const confirmLogout = () => {
    // Cancella il localStorage
    localStorage.clear();

    // Chiudi il popup di conferma
    setShowConfirmation(false);

    // Esegui il reindirizzamento a '/' con un ritardo di 3 secondi
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };


  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="#">
          <img className='logo' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd39tQpOa_ZYy6KkWTebn-36B0Jr6fAgoBVw&usqp=CAU" alt="" />
        </Navbar.Brand>
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">Link</Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            
          </Nav>
          <Button variant='outline-primary' className='w-25 py-3' onClick={handleLogout}>LogOut</Button>
          <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
            <Modal.Header className='bg-secondary' closeButton>
              <Modal.Title className=' text-white'>Conferma Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-secondary text-white'>
              Sei sicuro di voler effettuare il logout?
            </Modal.Body>
            <Modal.Footer className='bg-secondary'>
              <Button variant="dark" onClick={() => setShowConfirmation(false)}>
                Annulla
              </Button>
              <Button variant="primary" onClick={confirmLogout}>
                Conferma
              </Button>
            </Modal.Footer>
          </Modal>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;