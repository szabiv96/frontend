import { useMemo } from 'react';
import BlogPreview from '../components/BlogPreview';
import ImageWithLoading from '../components/ImageWithLoading';
import { Link } from 'react-router-dom';
import { findAuthor, formatContentDate } from '../utils/content';
import Seo from '../components/Seo';
import { truncateText } from '../utils/seo';

function Quit({ posts, authors }) {
  const sortedPosts = useMemo(() => {
    if (!Array.isArray(posts)) {
      return [];
    }

    return [...posts].sort((leftPost, rightPost) => {
      const leftDate = new Date(leftPost?.publishedAt || leftPost?._createdAt || 0).getTime();
      const rightDate = new Date(rightPost?.publishedAt || rightPost?._createdAt || 0).getTime();

      return rightDate - leftDate;
    });
  }, [posts]);

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

  const firstPost = sortedPosts[0];
  const authorRef = firstPost.author?._ref;
  const highlightedAuthor = findAuthor(authors, authorRef);

  return (
    <>
      <Seo
        title='Quit'
        description={truncateText(
          'Current thoughts, essays, and art critique by Varga Szabolcs Lajos.',
          160
        )}
        image={firstPost.mainImageUrl}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Quit',
          description: 'Current thoughts, essays, and art critique by Varga Szabolcs Lajos.',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: sortedPosts.map((post, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `/quit/${post._rev}`,
              name: post.title,
            })),
          },
        }}
      />
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
            alt={`Featured image for ${firstPost.title}`}
          />
        </div>
        <div className='right'>
          <h4><Link to={`/quit/${firstPost._rev}`}>{firstPost.title}</Link></h4>
          <h5>{highlightedAuthor?.name || 'Unknown author'}</h5>
          <h4>{formatContentDate(firstPost.publishedAt || firstPost._createdAt)}</h4>
        </div>
      </div>
      <div className='posts margin-02'>
        {sortedPosts.map((post, idx) => (
          <BlogPreview key={post._id || post._rev || idx} post={post} authors={authors} />
        ))}
      </div>
    </>
  );
}

export default Quit;
