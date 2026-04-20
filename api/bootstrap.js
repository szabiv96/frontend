const {
  getImageBuilder,
  getSanityClient,
  getSanityConfigError,
  serializePicture,
  serializePost,
} = require('./_sanity');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const configError = getSanityConfigError();

  if (configError) {
    res.status(500).json({ error: configError });
    return;
  }

  try {
    const client = getSanityClient();
    const imageBuilder = getImageBuilder();
    const [posts, cvDatas, pictures, authors] = await Promise.all([
      client.fetch('*[_type == "post"]'),
      client.fetch('*[_type == "cv"]'),
      client.fetch('*[_type == "pictures"] | order(_updatedAt desc)'),
      client.fetch('*[_type == "author"]'),
    ]);

    res.status(200).json({
      posts: posts.map((post) => serializePost(post, imageBuilder)),
      cvDatas,
      pictures: pictures.map((picture) => serializePicture(picture, imageBuilder)),
      authors,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
};
