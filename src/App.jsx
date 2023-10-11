import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CarefullyKept from './pages/CarefullyKept';
import client from './sanityClient';
import SoloAlbum from './pages/SoloAlbum';
import Quit from './pages/Quit';
import Post from './pages/Post';
import Footer from './components/Footer';
import CV from './pages/Cv';

export default function App() {


  const [cvDatas, setCVDatas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pictures, setPictures] = useState([]);
  const [authors, setAuthors] = useState([]);

  //fetchelése a posztokhoz adatokhoz gyűjteményeknek
  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    client
      .fetch(`*[_type == "post"]`)
      .then((data) => {
        if (isMounted) {
          setPosts(data);
          setLoading(false);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false; // Set flag to false when the component is unmounted
    };
  }, []);

  //fetchelése az önéletrajzi adatokhoz gyűjteményeknek
  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    client
      .fetch(`*[_type == "cv"]`)
      .then((data) => {
        if (isMounted) {
          setCVDatas(data);
          setLoading(false);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false; // Set flag to false when the component is unmounted
    };
  }, []);


  //fetchelése a kép gyűjteményeknek
  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    client
      .fetch(`*[_type == "pictures"]`)
      .then((data) => {
        if (isMounted) {
          setPictures(data);
          setLoading(false);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false; // Set flag to false when the component is unmounted
    };
  }, []);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    client
      .fetch(`*[_type == "author"]`)
      .then((data) => {
        if (isMounted) {
          setAuthors(data);
          setLoading(false);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false; // Set flag to false when the component is unmounted
    };
  }, []);


  /* console.log(cvDatas); */
  console.log(posts);
  /* console.log(pictures); */
  /* console.log(authors); */

  if (loading) {
    // Data is still loading, show a loading message or spinner
    return <div className='loading'>
      <p>EZT AZ ÜZENETET NEM LENNE SZABAD TUDNOD ELOLVASNOD! </p>
    </div>
  }

  return (
    <>
    <div className='site'>
        <Header />
          <Routes>
            <Route path="/" element={<Home cvDatas={cvDatas} posts={posts} authors={authors} />} />
            <Route path="/gallery/*" element={<CarefullyKept pictures={pictures} />} />
            <Route path="/quit" element={<Quit posts={posts} authors={authors} />} />
            <Route path="/cv" element={<CV cvDatas={cvDatas} />} />
            {pictures.map((picture) => (
              <Route
                key={picture._id}
                path={`/gallery/${picture._id}`}
                element={<SoloAlbum title={picture.collectionName} picture={picture} loading={loading} />}
              />
            ))}
            {posts.map((post, idx) => (
              <Route
                key={idx}
                path={`/quit/${post._rev}`}
                element={<Post title={post.title} post={post} authors={authors} />}
              />
            ))}
          </Routes>
          <Footer />
          </div>
    </>
  );
}