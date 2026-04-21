import './App.scss';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CarefullyKept from './pages/CarefullyKept';
import SoloAlbum from './pages/SoloAlbum';
import Quit from './pages/Quit';
import Post from './pages/Post';
import Footer from './components/Footer';
import CV from './pages/Cv';
import { fetchJson } from './api';

const FORCE_LOADING_SCREEN = false;

export default function App() {
  const [cvDatas, setCVDatas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pictures, setPictures] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetchJson('/api/bootstrap', { signal: abortController.signal })
      .then((data) => {
        setPosts(data.posts || []);
        setCVDatas(data.cvDatas || []);
        setPictures(data.pictures || []);
        setAuthors(data.authors || []);
        setDataError(null);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return;
        }

        setDataError(error.message);
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, []);

  if (dataError) {
    return (
      <div className='statusScreen'>
        <div className='statusCard'>
          <h2>Unable to load portfolio data</h2>
          <p>{dataError}</p>
          <p>For secure local development, use `npm run vercel-dev` instead of the plain Vite dev server.</p>
        </div>
      </div>
    );
  }

  if (loading || FORCE_LOADING_SCREEN) {
    return (
      <div className='statusScreen'>
        <div className='statusCard statusCardLoading'>
          <div className='statusSpinner' aria-hidden='true'></div>
          <h2>Loading portfolio</h2>
          <p>It should take only less then a second. :- )</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='site'>
        <Header />
        <Routes>
          <Route path="/" element={<Home cvDatas={cvDatas} posts={posts} authors={authors} />} />
          <Route path="/gallery/*" element={<CarefullyKept pictures={pictures} />} />
          <Route path="/gallery/:pictureId" element={<SoloAlbum pictures={pictures} />} />
          <Route path="/quit" element={<Quit posts={posts} authors={authors} />} />
          <Route path="/cv" element={<CV cvDatas={cvDatas} />} />
          {posts.map((post, idx) => (
            <Route
              key={post._id || post._rev || idx}
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
