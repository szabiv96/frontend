import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useParams } from 'react-router-dom';
import ImageWithLoading from '../components/ImageWithLoading';
import BackButton from '../components/BackButton';
import { fetchJson } from '../api';

function SoloAlbum({ pictures }) {
  const { pictureId: pictureIdParam } = useParams();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pract, setPract] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const pictureId = pictureIdParam || '';
    const pictureFromBootstrap = Array.isArray(pictures)
      ? pictures.find((picture) => picture._id === pictureId)
      : null;

    if (pictureFromBootstrap) {
      setPract(pictureFromBootstrap);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    if (pictureId) {
      fetchJson(`/api/pictures/${encodeURIComponent(pictureId)}`)
        .then((data) => {
          if (isMounted) {
            setPract(data || null);
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error('Error fetching data:', error);
            setPract(null);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [pictureIdParam, pictures]);

  const images =
    pract?.imageGallery?.map((image) => ({
      original: image.url || '',
      thumbnail: image.thumbnailUrl || image.url || '',
      description: image.caption || '',
    })) || [];

  const openGallery = (index) => {
    setIsGalleryOpen(true);
    setInitialSlideIndex(index);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (isGalleryOpen) {
      document.body.classList.add('gallery-view-open');
    } else {
      document.body.classList.remove('gallery-view-open');
    }

    window.dispatchEvent(new Event('footer-visibility-change'));

    return () => {
      document.body.classList.remove('gallery-view-open');
      window.dispatchEvent(new Event('footer-visibility-change'));
    };
  }, [isGalleryOpen]);

  if (loading) {
    return (
      <div className='statusScreen'>
        <div className='statusCard'>
          <h2>Loading album</h2>
          <p>Fetching artwork collection details.</p>
        </div>
      </div>
    );
  }

  if (!pract) {
    return (
      <div className='statusScreen'>
        <div className='statusCard'>
          <h2>Album not found</h2>
          <p>The requested artwork collection could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='background01 variant'></div>
      <BackButton />
      <div className='soloAlbumContainer'>
        <div className='aboutCollections'>
          <h1>{pract?.collectionName}</h1>
          <p>{pract?.description}</p>
        </div>
        <div className='pictures margin-02'>
          {pract?.imageGallery?.length > 0 &&
            pract.imageGallery.map((image, idx) => {
              return (
                <div
                  className='picture'
                  key={image._key || image.asset?._ref || idx}
                  onClick={() => {
                    openGallery(idx);
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  <ImageWithLoading
                    src={image.url || ''}
                    alt=""
                  />
                </div>
              );
            })}
        </div>
        <div className={`gallery-overlay ${isGalleryOpen ? 'gallery-open' : ''}`}>
          {isGalleryOpen && (
            <>
              <div className='gallery-close' onClick={closeGallery}>
                X
              </div>
              <ImageGallery
                items={images.map((image) => ({
                  original: image.original,
                  thumbnail: image.thumbnail,
                  description: image.description,
                }))}
                startIndex={initialSlideIndex}
                showPlayButton={false}
                showFullscreenButton={false}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SoloAlbum;
