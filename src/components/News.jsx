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


    const highlightedPosts = posts.slice(2);
/*     console.log(highlightedPosts); */

    return (
        <div className='news'>
            {highlightedPosts ? (
                <>
                    {highlightedPosts.map((post, idx) => (
                        <BlogPreview
                            key={idx}
                            post={post}
                            idx={idx}
                            authors={authors}
                        />
                    ))}
                </>
            ) : (
                ' post is missing '
            )
            }
        </div>
    )
}
