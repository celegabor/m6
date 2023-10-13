import React, { useEffect, useState } from 'react';
import Card from '../card/Card-posts';
import UserCard from '../card/Users-card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ResponsivePagination from 'react-responsive-pagination';
import Spinner from 'react-bootstrap/Spinner';

import 'react-responsive-pagination/themes/classic.css';
import './latest.css'


const LatestPosts = ()=>{

    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [totalPagesUsers, setTotalPagesUsers] = useState(0)
    const [totalPagesPosts, setTotalPagesPosts] = useState(0)
    const [courentPagePosts, setCourentPagePosts] = useState(1)
    const [courentPageUsers, setCourentPageUsers] = useState(1)
    const [itemsPageUsers, setItemsPageUsers] = useState(3)
    const [itemsPagePosts, setItemsPagePosts] = useState(3)

    

      const getPosts = async ()=>{

          setIsLoading(true); 
          try {
              // const response = await fetch(`http://localhost:2105/posts/get?page=${courentPagePosts}&pageSize=${itemsPagePosts}`)
              const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/get?page=${courentPagePosts}&pageSize=${itemsPagePosts}`)

              const dataPosts = await response.json()

              setPosts(dataPosts.posts);
              setTotalPagesPosts(dataPosts.totalPages)

              setTimeout(() => {
                setIsLoading(false); 
              }, 300);

          } catch (e) {
            console.error('Errore nella fetch:', e);
          }
      }

      const getUsers = async () => {
        setIsLoading(true); 
          try {
            // const response = await fetch(`http://localhost:2105/users/get?page=${courentPageUsers}&pageSize=${itemsPageUsers}`);
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/get?page=${courentPageUsers}&pageSize=${itemsPageUsers}`);
            const dataUsers = await response.json();

            setUsers(dataUsers.users); 
            setTotalPagesUsers(dataUsers.totalPages)

            setTimeout(() => {
              setIsLoading(false); 
            }, 300); 
          } catch (e) {
            console.error('Errore nella fetch:', e);
          }
      };

      const deletePost = async (postId) => {
        
        setIsLoading(true); 
        const confirmDelete = window.confirm('Sei sicuro di voler cancellare questo utente?');

        if (!confirmDelete) {
          window.location.reload()
          return;
        }


        try {
          await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/delete/${postId}`, {
            method: 'DELETE',
          });
    
          window.location.reload()
          setTimeout(() => {
            setIsLoading(false); 
          }, 300);
        } catch (e) {
          console.error('Errore nella cancellazione del post:', e);
        }

      };

      const deleteUser = async (userId) => {

        setIsLoading(true); 
        const confirmDelete = window.confirm('Sei sicuro di voler cancellare questo utente?');

        if (!confirmDelete) {
          setTimeout(() => {
            setIsLoading(false); 
          }, 300);
          return;
        }

        try {
          await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/delete/${userId}`, {
            method: 'DELETE',
          });
    
          window.location.reload()
          setTimeout(() => {
            setIsLoading(false); 
          }, 300);
        } catch (e) {
          console.error('Errore nella cancellazione del post:', e);
        }
        getUsers()

      };

      const handlePaginationPosts = (value)=>{
        setCourentPagePosts(value);
      }
      const handlePaginationUsers = (value)=>{
        setCourentPageUsers(value);
      }

      useEffect(() => {
        getPosts();
        getUsers();
      }, [courentPagePosts, itemsPagePosts,courentPageUsers,
        itemsPageUsers]);

    return(
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

            {/* add post/user */}
              <div className='button-add-container'>
                <Link to={`/addUser`}>
                  <Button className='button-add' variant="success">aggiungi un nuovo UTENTE</Button>
                </Link>
                <Link to={`/addPost`}>
                  <Button className='button-add' variant="secondary">aggiungi un nuovo POST</Button>
                </Link>
              </div>

            {/* post */}
              <h1>posts</h1>
              <div className="user-list">
                  {posts.map((post) => (
                  <div className="cards" key={post._id}>
                      <Card post={post} />
                      <div className='d-flex'>
                        <Button className='m-2' variant='danger' onClick={() => deletePost(post._id)}>Cancella</Button>
                        <Link to={`/modificaPost/${post._id}`}>
                          <Button className='m-2' variant='success'>Modifica</Button>
                        </Link>
                      </div>
                  </div>
                  ))}
              </div>
              <div className='pagination-container'>
                <ResponsivePagination
                  current={courentPagePosts}
                  total={posts && totalPagesPosts} 
                  onPageChange={handlePaginationPosts}
                />
              </div>
              {/* -------------------------- */}

            {/* users */}
              <h1>users</h1>
              <div className="user-list">
                  {users.map((user) => (
                  <div className="cards" key={user._id}>
                      <UserCard user={user} />
                      <div className='d-flex'>
                        <Button className='m-2' variant='danger' onClick={() => deleteUser(user._id)}>Cancella</Button>
                        <Link to={`/modificaUser/${user._id}`}>
                          <Button className='m-2' variant='success'>Modifica</Button>
                        </Link>
                      </div>
                  </div>
                  ))}
              </div>
              <div className='pagination-container'>
                <ResponsivePagination
                  current={courentPageUsers}
                  total={users && totalPagesUsers} 
                  onPageChange={handlePaginationUsers}
                />
              </div>  
            </>
        )}



      </>
    )
}

export default LatestPosts;