import React from 'react'
import NavbarElement from '../components/navbar/navbar';
import PostProvider from "../context/Context";
import './home.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FooterElement from '../components/footer/Footer';
import LatestPosts from '../components/LatestPosts/LatestPosts'




const Home = ()=> {
  return (
    <PostProvider>
      <nav>
        <NavbarElement/>
      </nav>
      <main>
        <LatestPosts/>
      </main>
      <footer>
        <FooterElement/>
      </footer>
    </PostProvider>
  )
}

export default Home;