import React from 'react'
import imageUrlBuilder from '@sanity/image-url';
import client from '../sanityClient';
import { Link } from 'react-router-dom';

function urlFor(source) {
    return builder.image(source)
}

const builder = imageUrlBuilder(client)

export default function Album({ details, collectionName, picture, description }) {

    const targetDiv = document.querySelector('.footer');

    return (
        <div className='album'
            onClick={() => {
                targetDiv.classList.remove("footerShow");
                targetDiv.classList.add("footerHide");
            }} >
            <div className='imgContainer'>
                <Link to={`/gallery/${details._id}`}>
                    <div className='decor'>
                        <div className='inside'
                            onClick={() => {
                                targetDiv.classList.remove("footerShow");
                                targetDiv.classList.add("footerHide");
                            }}>
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
