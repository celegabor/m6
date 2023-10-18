import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './card-posts.css';

const Card = ({ post }) => {
  const [showAuthor, setShowAuthor] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newUser, setNewUser] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState(false)

  // Recupera il token dalla memoria locale
  const token = JSON.parse(localStorage.getItem('loggedInUser'))


  const toggleAuthor = () => {
    setShowAuthor(!showAuthor);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const getComments = () => {
    if (showComments) {
      fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/comment/get`,{
        headers:{
          'Authorization': token,
        }
      })
        .then((response) => response.json())
        .then((data) => {
          const filteredComments = data.comments.filter((comment) => comment.postId === post._id);
          setComments(filteredComments);
        })
        .catch((error) => {
          console.error('Errore nel recupero dei commenti:', error);
        });
    }
  };

  useEffect(() => {
    getComments();
  }, [showComments, post._id]);

  const addComment = () => {
    if (newComment.trim() === '') {
      return;
    }

    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/${post._id}/comment/post`, {
      method: 'POST',
      headers: { 
        'Authorization': token,
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
        getComments();
        setNewComment('');
        setNewUser('');
      })
      .catch((error) => {
        console.error('Errore nell\'aggiunta del commento:', error);
      });
  };

  const deleteComment = (commentId) => {
    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/comment/delete/${commentId}`, {
      method: 'DELETE',
      headers:{
        'Authorization': token,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        getComments();
      })
      .catch((error) => {
        console.error('Errore durante l\'eliminazione del commento:', error);
      });
  };

  const startEditComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment._id === commentId);
    setEditCommentId(commentId);
    setNewComment(commentToEdit.comment);
    setNewUser(commentToEdit.author._id);

    setEditComment(true)
  };

  const saveEditedComment = (commentId) => {
    if (newComment.trim() === '' || newUser.trim() === '') {
      return;
    }

    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/comment/put/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        comment: newComment,
        author: newUser,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        getComments();
        cancelEdit();
        setEditComment(false)
      })
      .catch((error) => {
        console.error('Errore durante la modifica del commento:', error);
      });
  };

  const cancelEdit = () => {
    setEditCommentId(null);
    setNewComment('');
    setNewUser('');
    setEditComment(false)
  };

  return (
    <div className="card-details">
      <div className="dettails-post">
        <img src={post.cover} alt={post.cover} />
        <h4>{post.title}</h4>
        <p>Category: {post.category}</p>
        <p>R.T.: {post.readTime.value}-{post.readTime.unit}</p>
      </div>
      <Button variant="info" className="button-details-user-out p-0 py-1" onClick={toggleAuthor}>
        {showAuthor ? '' : '? user ?'}
      </Button>
      <Button variant="info" className="" onClick={toggleComments}>
        {showComments ? 'Nascondi commenti' : 'Mostra commenti'}
      </Button>

      {showAuthor && (
        <div className="user-detail">
          <Button variant="info" className="button-details-user-in py-1" onClick={toggleAuthor}>
            {showAuthor ? 'X' : 'dettagli autore'}
          </Button>

          {post.author ? (
            <div className="user-details">
              <img src={post.author.avatar} alt="immagine autore" />
              <p>nome: {post.author.name}</p>
              <p>cognome: {post.author.lastName}</p>
              <p>email: {post.author.email}</p>
              <p>gg nascita: {post.author.dob}</p>
            </div>
          ) : (
            <div>
              <p className="not-user">
                <i>ops...<br />nessun autore da mostrare...</i>
              </p>
            </div>
          )}
        </div>
      )}

      {showComments && (
        <>
          <div className="comments-section">
            <div className="comments-list">
              {comments.map((comment) => (
                <div className="comment" key={comment._id}>
                  <div className="d-flex align-items-center position-relative">
                    <img className="img-comments" src={comment.author.avatar} alt="niente img" />
                    <p className="m-3">{comment.author.name} {comment.author.lastName}</p>
                    {editCommentId === comment._id ? (
                      null
                    ):(
                      <div className="button">
                        <Button className="m-2" variant="success" onClick={() => startEditComment(comment._id)}>
                          modifica
                        </Button>
                        <Button className="m-2" variant="danger" onClick={() => deleteComment(comment._id)}>
                          elimina
                        </Button>
                      </div>
                    )}
                    {editCommentId === comment._id ? (
                      <div>
                        <input
                          className="w-50 m-2"
                          type="text"
                          placeholder="Modifica il commento..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        {/* <input
                          className="w-50 m-2"
                          type="text"
                          placeholder="Modifica l'ID utente..."
                          value={newUser}
                          onChange={(e) => setNewUser(e.target.value)}
                        /> */}
                        <Button className="m-2 w-50" variant="success" onClick={() => saveEditedComment(comment._id)}>
                          Salva
                        </Button>
                        <Button className="m-2" variant="secondary" onClick={cancelEdit}>
                          Annulla
                        </Button>
                      </div>
                    ) : (
                      <p className="commento bg-dark">{comment.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {editComment === true ? ( null) : (
            <div className="w-100 d-flex">
              <div className="w-100">
                <input
                  className="mt-3 input-add-custom"
                  type="text"
                  placeholder="Aggiungi un commento..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <input
                  className="mt-2 input-add-custom"
                  type="text"
                  placeholder="Aggiungi un id utente..."
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
              </div>
              <Button className="w-25 m-4" variant="primary" onClick={addComment}>
                Aggiungi Commento
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Card;
