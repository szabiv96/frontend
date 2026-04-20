import { Link } from 'react-router-dom';
import { findAuthor, formatContentDate } from '../utils/content';

export default function BlogPreview({ post, authors }) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    const author = findAuthor(authors, post.author?._ref);

    return (
        <div className='post'>
            <p>{author?.name || 'Unknown author'}</p>
            <h4>
                <Link to={`/quit/${post._rev}`} onClick={scrollToTop}>
                    {post.title}
                </Link>
            </h4>
            <h5>{formatContentDate(post.publishedAt || post._createdAt)}</h5>
        </div>
    );
}
