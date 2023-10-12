import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import client from '../sanityClient';
import BackButton from '../components/BackButton';

function urlFor(source) {
  return builder.image(source)
}

const builder = imageUrlBuilder(client)

export default function Post({ post, authors }) {
  // Check if post.body is undefined or empty
  if (!post.body || post.body.length === 0) {
    // If post.body is undefined or empty, display a loading screen or a message
    return <div>Loading...</div>;
  }

  console.log(post);
  const authorRRef = post.author._ref;
  const author = authors.find((aut, idx) => aut._id === authorRRef);

  const myPortableTextComponents = {
    types: {
      image: ({ value }) => <img src={urlFor(value.asset._ref)} />,
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
        <h5>{author.name}</h5>
        <h5>
          {post._createdAt ? (
            <>
              {post._createdAt.slice(0, -10)}, {post._createdAt.slice(11, -4)}
            </>
          ) : (
            'Publication Date Missing' // Handle the case when publishedAt is undefined
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
