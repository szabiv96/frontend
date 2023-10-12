import React from 'react'
import imageUrlBuilder from '@sanity/image-url';
import client from '../sanityClient';
import { Link } from 'react-router-dom';
import ImageWithLoading from './ImageWithLoading';
import BackButton from './BackButton';

function urlFor(source) {
    return builder.image(source)
}

const builder = imageUrlBuilder(client)

export default function Album({ details, collectionName, picture, description }) {

    const targetDiv = document.querySelector('.footer');

    return (
        <div className='album'>
            <div className='image-container'>
                <Link to={`/gallery/${details._id}`}>
                    <div className='decor'>
                        <div className='inside'>
                            <h1>{collectionName}</h1>
                        </div>
                    </div>
                    <ImageWithLoading
                        src={urlFor(picture)}
                        alt=""
                    />
                </Link>
            </div>
        </div>
    )
}
