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

    return (
        <div className='news'>
            {
                posts.map((post, idx) => (
                    <BlogPreview
                        key={idx}
                        post={post}
                        idx={idx}
                        authors={authors}
                    />
                ))
            }
        </div>
    )
}
