import React from 'react'
import { Link } from 'react-router-dom';

export default function BlogPreview({ idx, post, authors }) {
    return (
        <div className='post' key={idx}>
            {authors.map((author) => {
                if (author._id === post.author?._ref) {
                    return <p key={idx}>{author.name}</p>;
                }
                return null;
            })}
            <h4>
                <Link to={`/quit/${post._rev}`}>
                    {post.title}
                </Link>
            </h4>
            <h5>{post.publishedAt.slice(0, -14)}, {post.publishedAt.slice(11, -8)}</h5>
        </div>
    )
}
