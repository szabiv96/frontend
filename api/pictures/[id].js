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

  const pictureId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!pictureId) {
    res.status(400).json({ error: 'Missing picture id' });
    return;
  }

  try {
    const client = getSanityClient();
    const imageBuilder = getImageBuilder();
    const picture = await client.fetch(
      '*[_type == "pictures" && _id == $id][0]',
      { id: pictureId }
    );

    if (!picture) {
      res.status(404).json({ error: 'Picture not found' });
      return;
    }

    res.status(200).json(serializePicture(picture, imageBuilder));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch picture' });
  }
};
