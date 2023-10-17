import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './card-posts.css'

const Card = ({ post }) => {
  const [showAuthor, setShowAuthor] = useState(false);
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newUser, setNewUser] = useState('')

  const toggleAuthor = () => {
    setShowAuthor(!showAuthor);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const getComments = ()=>{
    if (showComments) {
      fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/comment/get`)
        .then((response) => response.json())
        .then((data) => {

          const filteredComments = data.comments.filter((comment) => comment.postId === post._id);
          setComments(filteredComments);
        })
        .catch((error) => {
          console.error('Errore nel recupero dei commenti:', error);
        });
    }
  }

  useEffect(() => {
    getComments()
  }, [showComments, post._id]);
  
  const addComment = () => {
    if (newComment.trim() === '') {
      return;
    }
  
    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${post._id}/comment/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: newComment,
        postId: post._id, 
        author: newUser,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        getComments()
  
        setNewComment('');
        setNewUser('');
      })
      .catch((error) => {
        console.error('Errore nell aggiunta del commento:', error);
      });
  };
  

  return (
    <div className='card-details'>

      <div className='dettails-post'>
        <img src={post.cover} alt={post.cover} /> 
        <h4>{post.title}</h4>
        <p>Category: {post.category}</p>
        <p>R.T.: {post.readTime.value}-{post.readTime.unit}</p>
      </div>
      <Button variant="info" className='button-details-user-out p-0 py-1' onClick={toggleAuthor}>
        {showAuthor ? '' : '? user ?'}
      </Button>
      <Button variant="info" className='' onClick={toggleComments}>
          {showComments ? 'nascondi' : 'mostra commenti'}
        </Button>

  
      {showAuthor && (
        <div className='user-detail'>
          <Button variant="info" className='button-details-user-in py-1' onClick={toggleAuthor}>
            {showAuthor ? 'X' : 'dettagli autore'}
          </Button>

          {post.author ? (
            <div className='user-details'>
              <img src={post.author.avatar} alt="immagine autore" />
              <p>nome: {post.author.name}</p>
              <p>cognome: {post.author.lastName}</p>
              <p>email: {post.author.email}</p>
              <p>gg nascita: {post.author.dob}</p>
            </div>
          ) : (
            <div>
              <p className='not-user'><i>ops...<br/>nessun autore da mostrare...</i></p>
            </div>
          )}
        </div>
      )}

      {showComments && (
        <>
          <div className='comments-section'>
            <div className='comments-list'>
              <p>Commenti:</p>
              {comments.map((comment) => (
                <>
                  <div className='comment.custom' key={comment._id}>
                    <img className='img-comments' src={comment.author.avatar} alt="niente img"></img>
                    <p>: {comment.comment}</p>
                    <p>-------------</p>
                  </div>
                </>
              
              ))}
            </div>
          </div>
          <div className='w-100 d-flex'>
            <div className='w-100'>
              <input
                className='w-100 m-2'
                type="text"
                placeholder="Aggiungi un commento..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <input
                className='w-100 m-2'
                type="text"
                placeholder="Aggiungi un id utente..."
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />
            </div>
            <Button className='w-25 m-4' variant="primary" onClick={addComment}>Aggiungi Commento</Button>

          </div>
        </>
    
      )}

    </div>
  );
}
  
export default Card;