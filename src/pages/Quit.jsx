import imageUrlBuilder from '@sanity/image-url';
import client from '../sanityClient';
import BlogPreview from '../components/BlogPreview';

function urlFor(source) {
  return builder.image(source);
}

const builder = imageUrlBuilder(client);

function Quit({ posts, authors }) {

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return <div className='loading'>
      <p>EZT AZ ÜZENETET NEM LENNE SZABAD TUDNOD ELOLVASNOD! </p>
    </div>; // Render a loading message or alternative content
  }

  if (!authors || !Array.isArray(authors) || authors.length === 0) {
    return <div className='loading'>
      <p>EZT AZ ÜZENETET NEM LENNE SZABAD TUDNOD ELOLVASNOD! </p>
    </div>; // Render a loading message or alternative content
  }

  const firstPost = posts[0];
  const authorRef = firstPost.author._ref;
  const highlightedAuthor = authors.find((author, idx) => author._id === authorRef)

  /* console.log(highlightedAuthor); */

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
          <img src={urlFor(firstPost.mainImage.asset._ref)} alt="kép" />
        </div>
        <div className='right'>
          <h4>{firstPost.title}</h4>
          <h5>{highlightedAuthor.name}</h5>
          <h4>{firstPost.publishedAt.slice(0, -14)}, {firstPost.publishedAt.slice(11, -8)}</h4>
        </div>
      </div>
      <div className='posts margin-02'>
        {
          posts.map((post, idx) => (
            <BlogPreview key={idx} post={post} idx={idx} authors={authors} />
          ))
        }
      </div>
    </>
  )
}

export default Quit;