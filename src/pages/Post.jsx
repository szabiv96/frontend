import { PortableText } from '@portabletext/react';
import BackButton from '../components/BackButton';
import { findAuthor, formatContentDate } from '../utils/content';

export default function Post({ post, authors }) {
  if (!post.body || post.body.length === 0) {
    return <div>Loading...</div>;
  }

  const author = findAuthor(authors, post.author?._ref);

  const myPortableTextComponents = {
    types: {
      image: ({ value }) => <img src={value.imageUrl || ''} alt="" />,
      callToAction: ({ value, isInline }) =>
        isInline ? (
          <a href={value.url}>{value.text}</a>
        ) : (
          <div className="callToAction">{value.text}</div>
        ),
    }
  }

  return (
    <>
      <div className='background02'></div>
      <BackButton />
      <div className='post margin-02'>
        <h1 className='margin-01'>{post.title}</h1>
        <h5>{author?.name || 'Unknown author'}</h5>
        <h5>{formatContentDate(post.publishedAt || post._createdAt)}</h5>
        <PortableText
          value={post.body}
          components={myPortableTextComponents}
        />
      </div>
    </>
  );
}
