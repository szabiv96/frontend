const {
  getImageBuilder,
  getSanityClient,
  getSanityConfigError,
  serializePicture,
} = require('../_sanity');

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
    const pictures = await client.fetch('*[_type == "pictures"]');

    res.status(200).json({
      pictures: pictures.map((picture) => serializePicture(picture, imageBuilder)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pictures' });
  }
};
