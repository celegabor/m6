import React, { useEffect, useState } from 'react';
import Card from '../card/Card-posts';
import UserCard from '../card/Users-card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ResponsivePagination from 'react-responsive-pagination';
import Spinner from 'react-bootstrap/Spinner';
import useSession from "../../hooks/useSession";
import Form from 'react-bootstrap/Form';


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
    const [inputText, setInputText] = useState(''); 
    const [filteredPosts, setFilteredPosts] = useState([]); 
    const [filteredUsers, setFilteredUsers] = useState([]); 
  
     // Recupera il token dalla memoria locale
     const token = JSON.parse(localStorage.getItem('loggedInUser'))

    const session = useSession()

    const handleSearch = () => {
      setFilteredPosts([]);
      setFilteredUsers([]);

      if (inputText) {
        const filteredPosts = posts.filter((post) =>
          post.title.toLowerCase().includes(inputText.toLowerCase())
        );
  
        const filteredUsers = users.filter((user) =>
          user.name.toLowerCase().includes(inputText.toLowerCase())
        );
  
        setFilteredPosts(filteredPosts);
        setFilteredUsers(filteredUsers);
      } 
    };
    
    const getPosts = async ()=>{

      

        setIsLoading(true); 
        
      try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/get?page=${courentPagePosts}&pageSize=${itemsPagePosts}`,{
            headers:{
              'Authorization': token,
            }
          })

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
          
          const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/get?page=${courentPageUsers}&pageSize=${itemsPageUsers}`,{
            headers:{
              'Authorization': token,
            }
          });

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
        setTimeout(() => {
          setIsLoading(false); 
        }, 300);
        return;
      }
      
      try {
        await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/delete/${postId}`, {
          headers:{
            'Authorization': token,
          },
          method: 'DELETE',
        });
  
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
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
          headers:{
            'Authorization': token,
          },
          method: 'DELETE',
        });
        
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
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
      handleSearch();
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

            {/* search section */}
            <div className='bg-dark px-5 p-2'>
              <Form className="d-flex w-25">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2 bg-dark text-white"
                  aria-label="Search"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Button variant="outline-success" onClick={handleSearch}>
                  Search
                </Button>
              </Form>
                <div className='d-flex justify-content-around m-3'>

                  {filteredPosts.map((postFiltered) => (
                    <div className="cards p-5" key={postFiltered._id}>
                      <Card post={postFiltered} />
                        <div className='d-flex'>
                        </div>
                    </div>
                  ))}

                  {filteredUsers.map((userFiltered) => (
                    <div className="cards p-5" key={userFiltered._id}>
                      <UserCard user={userFiltered} />
                        <div className='d-flex'>
                        </div>
                    </div>
                  ))}
                </div>
            </div>

            {/* add post/user */}
            {token && 
              <div className='button-add-container'>
                <Link className='w-75' to={`/addPost`}>
                  <Button className='button-add w-100' variant="dark">aggiungi un nuovo POST</Button>
                </Link>
              </div>
            }

            {/* post */}
              <div className="user-list">
                {posts ? (
                  <>
                    <h1>posts</h1>
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
                  </>
                  ) : (
                    <>
                    <h1 className='bg-danger text-white p-3 m-4'>ATTENZIONE !!! ATTENZIONE !!!</h1>
                    <h1 className='bg-warning text-white p-3 m-4'>CREDENZIALI SCADUTE O NON VALIDE. </h1>
                    <h1 className='bg-danger text-white p-3 m-4'>DEVI EFFETTUARE NUOVAMENTE IL LOGIN. CLICCA QUA PER ACCEDERE NUOVAMENTE:</h1>
                    <Link className='w-100 m-4 d-flex justify-content-center' to={`/`}>
                      <Button className='w-50' variant="warning">clicca qua</Button>
                    </Link>
                  </>

                  )}
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
              <div className="user-list">
                {users? ( 
                  <>
                    <h1>users</h1>
                    {users.map((user) => (
                      <div className="cards" key={user._id}>
                          <UserCard user={user} />
                          <div className='cancella-modifica-post'>

                            <Button className='m-2' variant='danger' onClick={() => deleteUser(user._id)}>Cancella</Button>

                            <Link to={`/modificaUser/${user._id}`}>
                              <Button className='m-2' variant='success'>Modifica</Button>
                            </Link>
                            
                          </div>
                      </div>
                    ))}
                  </>

                ) : (
                  null
                )}
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