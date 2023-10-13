import Nav from 'react-bootstrap/Nav';
import './Footer.css'

const FooterElement = () => {
  return (
    <>
      <Nav className="footer-custom justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link className='nav-link' href="/home">Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default FooterElement;