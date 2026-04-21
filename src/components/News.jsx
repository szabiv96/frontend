import BlogPreview from "./BlogPreview";

export default function News({ posts, authors }) {

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
        return <div >
            <p>Loading</p>
        </div>; // Render a loading message or alternative content
    }

    if (!authors || !Array.isArray(authors) || authors.length === 0) {
        return <div>
            <p>Loading</p>
        </div>; // Render a loading message or alternative content
    }

    const highlightedPosts = posts.slice(0, 3);

    return (
        <div className='news'>
            {highlightedPosts.length > 0 ? (
                <>
                    {highlightedPosts.map((post, idx) => (
                        <BlogPreview
                            key={post._id || post._rev || idx}
                            post={post}
                            authors={authors}
                        />
                    ))}
                </>
            ) : (
                'Posts are missing.'
            )
            }
        </div>
    );
}
