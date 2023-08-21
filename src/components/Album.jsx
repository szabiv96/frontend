import React from 'react'
import imageUrlBuilder from '@sanity/image-url';
import client from '../sanityClient';
import { Link } from 'react-router-dom';

function urlFor(source) {
    return builder.image(source)
}

const builder = imageUrlBuilder(client)

export default function Album({ details, collectionName, picture, description }) {

    return (
        <div className='album' >
            <div className='imgContainer'>
                <Link to={`/gallery/${details._id}`}>
                    <div className='decor'>
                        <div className='inside'>
                            <h1>{collectionName}</h1>
                        </div>
                        <div className='inside2'>
                            <p>{description}</p>
                        </div>
                    </div>
                    <img src={urlFor(picture)} alt="" />
                </Link>
            </div>
        </div>
    )
}
