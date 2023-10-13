import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import './card-posts.css'

const Card = ({ post }) => {
  const [showAuthor, setShowAuthor] = useState(false);

  const toggleAuthor = () => {
    setShowAuthor(!showAuthor);
  };

  return (
    <div className='card-details'>
      <img src={post.cover} alt={post.cover} />
      <h4>{post.title}</h4>
      <p>Category: {post.category}</p>
      <p>Read Time: {post.readTime.value} {post.readTime.unit}</p>
      <Button variant="info" className='button-details-user-out p-0 py-1' onClick={toggleAuthor}>
        {showAuthor ? '' : '? user ?'}
      </Button>


      {showAuthor && (
        <div className='user-detail'>
          <Button variant="info" className='button-details-user-in py-1' onClick={toggleAuthor}>
            {showAuthor ? 'X' : 'dettagli autore'}
          </Button>
          {/* <img src={`${process.env.REACT_APP_SERVER_BASE_URL}/pubblic/${post.cover}`} alt={post.cover} /> */}
          <p>nome: {post.author.name}</p>
          <p>cognome: {post.author.lastName}</p>
          <p>email: {post.author.email}</p>
          <p>gg nascita: {post.author.dob}</p>
        </div>
      )}
    </div>
  );
};

export default Card;


