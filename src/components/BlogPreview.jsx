import React from 'react'
import { Link } from 'react-router-dom';

export default function BlogPreview({ idx, post, authors }) {


    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    /* console.log(post); */

    return (
        <div className='post' key={idx}>
            {authors.map((author) => {
                if (author._id === post.author?._ref) {
                    return <p key={idx}>{author.name}</p>;
                }
                return null;
            })}
            <h4>
                <Link to={`/quit/${post._rev}`} onClick={scrollToTop}>
                    {post.title}
                </Link>
            </h4>
            <h5>
                {post._createdAt ? (
                    <>
                        {post._createdAt.slice(0, -10)}, {post._createdAt.slice(11, -4)}
                    </>
                ) : (
                    'Publication Date Missing' // Handle the case when publishedAt is undefined
                )}
            </h5>
        </div>

    )
}
