import { useEffect, useMemo, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useParams } from 'react-router-dom';
import ImageWithLoading from '../components/ImageWithLoading';
import BackButton from '../components/BackButton';
import { fetchJson } from '../api';
import Seo from '../components/Seo';
import { buildArtworkAltText, truncateText } from '../utils/seo';

function SoloAlbum({ pictures }) {
  const { pictureId: pictureIdParam } = useParams();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pract, setPract] = useState(null);
  const pictureId = pictureIdParam || '';
  const pictureFromBootstrap = useMemo(
    () => (Array.isArray(pictures) ? pictures.find((picture) => picture._id === pictureId) : null),
    [pictureId, pictures]
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (pictureFromBootstrap) {
      setPract(pictureFromBootstrap);
      setLoading(false);
      return () => abortController.abort();
    }

    if (pictureId) {
      setLoading(true);

      fetchJson(`/api/pictures/${encodeURIComponent(pictureId)}`, { signal: abortController.signal })
        .then((data) => {
          setPract(data || null);
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setPract(null);
          }
        })
        .finally(() => {
          if (!abortController.signal.aborted) {
            setLoading(false);
          }
        });
    } else {
      setPract(null);
      setLoading(false);
    }

    return () => abortController.abort();
  }, [pictureFromBootstrap, pictureId]);

  const images =
    pract?.imageGallery?.map((image) => ({
      original: image.url || '',
      thumbnail: image.thumbnailUrl || image.url || '',
      description: image.caption || '',
      title: image.title || '',
      year: image.year || '',
      media: image.eng_media || image.media || '',
      size: image.size || '',
    })) || [];

  const activeArtwork = images[activeSlideIndex] || null;
  const activeArtworkDetails = [
    activeArtwork?.title,
    activeArtwork?.year,
    activeArtwork?.media,
    activeArtwork?.size,
  ].filter(Boolean);

  const openGallery = (index) => {
    setIsGalleryOpen(true);
    setInitialSlideIndex(index);
    setActiveSlideIndex(index);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  useEffect(() => {
    document.body.classList.toggle('gallery-view-open', isGalleryOpen);
    document.body.style.overflow = isGalleryOpen ? 'hidden' : 'auto';

    window.dispatchEvent(new Event('footer-visibility-change'));

    return () => {
      document.body.classList.remove('gallery-view-open');
      document.body.style.overflow = 'auto';
      window.dispatchEvent(new Event('footer-visibility-change'));
    };
  }, [isGalleryOpen]);

  if (loading) {
    return (
      <div className='statusScreen'>
        <div className='statusCard statusCardLoading'>
          <div className='statusSpinner' aria-hidden='true'></div>
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
      <Seo
        title={pract?.collectionName || 'Gallery'}
        description={truncateText(pract?.description || 'Artwork collection by Varga Szabolcs Lajos.', 160)}
        image={pract?.coverImageUrl || images[0]?.original}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: pract?.collectionName || 'Artwork collection',
          description: pract?.description || 'Artwork collection by Varga Szabolcs Lajos.',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: images.map((image, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'VisualArtwork',
                name: image.title || pract?.collectionName || `Artwork ${index + 1}`,
                image: image.original,
                artMedium: image.media || undefined,
                dateCreated: image.year || undefined,
              },
            })),
          },
        }}
      />
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
                  onClick={() => openGallery(idx)}
                >
                  <ImageWithLoading
                    src={image.url || ''}
                    alt={buildArtworkAltText(image, pract?.collectionName || 'Artwork image')}
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
                onSlide={setActiveSlideIndex}
              />
              {activeArtworkDetails.length > 0 && (
                <div className='galleryArtworkDetails'>
                  <p>{activeArtworkDetails.join(', ')}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SoloAlbum;
