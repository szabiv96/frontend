import { PortableText } from '@portabletext/react';
import BackButton from '../components/BackButton';

export default function Post({ post, authors }) {
  if (!post.body || post.body.length === 0) {
    return <div>Loading...</div>;
  }

  const authorRRef = post.author._ref;
  const author = authors.find((aut, idx) => aut._id === authorRRef);

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
        <h5>{author?.name}</h5>
        <h5>
          {post._createdAt ? (
            <>
              {post._createdAt.slice(0, -10)}, {post._createdAt.slice(11, -4)}
            </>
          ) : (
            'Publication Date Missing'
          )}
        </h5>
        <PortableText
          value={post.body}
          components={myPortableTextComponents}
        />
      </div>
    </>
  );
}
