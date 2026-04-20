import BlogPreview from '../components/BlogPreview';
import ImageWithLoading from '../components/ImageWithLoading';

function Quit({ posts, authors }) {
  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return <div className='loading'>
      <p>EZT AZ UZENETET NEM LENNE SZABAD TUDNOD ELOLVASNOD! </p>
    </div>;
  }

  if (!authors || !Array.isArray(authors) || authors.length === 0) {
    return <div className='loading'>
      <p>EZT AZ UZENETET NEM LENNE SZABAD TUDNOD ELOLVASNOD! </p>
    </div>;
  }

  const firstPost = posts[0];
  const authorRef = firstPost.author._ref;
  const highlightedAuthor = authors.find((author, idx) => author._id === authorRef)

  return (
    <>
      <div className='proposer'>
        <div className='background02'>
          <div className='landingText02 quitModif'>
            <h3>| Quit - QRRENT THOUGHTS & ART QRITIQUE</h3>
            <h3>&nbsp;&nbsp;| Quit - QRRENT THOUGHTS & ART QRITIQUE</h3>
          </div>
        </div>
        <div className='background03'></div>
        <div className='left'>
          <ImageWithLoading
            src={firstPost.mainImageUrl || ''}
            alt="kep"
          />
        </div>
        <div className='right'>
          <h4><a href={`/quit/${firstPost._rev}`}>{firstPost.title}</a></h4>
          <h5>{highlightedAuthor.name}</h5>
          <h4>
            {firstPost.publishedAt ? (
              <>
                {firstPost.publishedAt.slice(0, -14)}, {firstPost.publishedAt.slice(11, -8)}
              </>
            ) : (
              'Publication Date Missing'
            )}
          </h4>
        </div>
      </div>
      <div className='posts margin-02'>
        {posts.map((post, idx) => (
          <BlogPreview key={post._id || post._rev || idx} post={post} authors={authors} />
        ))}
      </div>
    </>
  )
}

export default Quit;
