import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import client from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

function urlFor(source) {
    return builder.image(source);
}

const builder = imageUrlBuilder(client);

function SoloAlbum({ picture }) {
    
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [initialSlideIndex, setInitialSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pictureId, setPictureId] = useState('');
    const [pract, setPract] = useState({});

    useEffect(() => {
        let isMounted = true; // Flag to track component mount status

        const currentPath = window.location.pathname;
        const galleryIndex = currentPath.indexOf('/gallery/');
        const extractedPictureId = currentPath.slice(galleryIndex + '/gallery/'.length);

        setPictureId(extractedPictureId);

        return () => {
            isMounted = false; // Set flag to false when the component is unmounted
        };
    }, []); // This effect runs only once on mount to set the pictureId

    useEffect(() => {
        // Use the fetch only when pictureId is defined and not null
        if (pictureId) {
            client
                .fetch(`*[_type == "pictures" && _id == "${pictureId}"]`)
                .then((data) => {
                    if (data && data.length > 0) {
                        setPract(data[0]);
                    } else {
                        setPract(null); // Set to null when data is not found
                    }
                    setLoading(false); // Mark the data loading as complete, regardless of success or failure
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false); // Mark the data loading as complete in case of an error
                });
        }
    }, [pictureId]); // This effect will run whenever pictureId changes


    const images = picture.imageGallery.map((image) => ({
        original: urlFor(image.picture.asset._ref),
        thumbnail: urlFor(image.picture.asset._ref),
        description: image.caption,
    }));

    const openGallery = (index) => {
        setIsGalleryOpen(true);
        setInitialSlideIndex(index);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    if (loading) {
        // Data is still loading, show a loading message or null
        return (
            <div className='loading'>
                <p>EZT AZ ÜZENETET NEM LENNE SZABAD TUDNOD ELOLVASNOD! </p>
            </div>
        );
    }

    return (
        <>
            <div className='background01 variant'></div>
            <div className='soloAlbumContainer'>
                <div className='aboutCollections'>
                    <h1>{pract.collectionName}</h1>
                    <p>{pract.description}</p>
                </div>
                <div className='pictures'>
                    {pract && pract.imageGallery && pract.imageGallery.length > 0 && (
                        pract.imageGallery.map((image, idx) => (
                            <div className='picture' key={idx} onClick={() => openGallery(idx)}>
                                <img src={urlFor(image.picture.asset._ref)} alt="" />
                            </div>
                        ))
                    )}
                </div>
                <div className={`gallery-overlay ${isGalleryOpen ? 'gallery-open' : ''}`}>
                    {isGalleryOpen && (
                        <>
                            <div className='gallery-close' onClick={closeGallery}>
                                X
                            </div>
                            <ImageGallery
                                items={images}
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
