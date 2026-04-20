const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');

function readEnv(...names) {
  for (const name of names) {
    if (process.env[name]) {
      return process.env[name];
    }
  }

  return undefined;
}

function getSanityConfig() {
  return {
    projectId: readEnv('SANITY_PROJECT_ID', 'PROJECT_ID_PORTFOLIO'),
    dataset: readEnv('SANITY_DATASET', 'DATASET_PORTFOLIO'),
    token: readEnv('SANITY_TOKEN', 'TOKEN'),
    apiVersion: '2021-10-21',
    useCdn: false,
  };
}

function getSanityConfigError() {
  const config = getSanityConfig();
  const missing = [];

  if (!config.projectId) {
    missing.push('SANITY_PROJECT_ID or PROJECT_ID_PORTFOLIO');
  }

  if (!config.dataset) {
    missing.push('SANITY_DATASET or DATASET_PORTFOLIO');
  }

  return missing.length > 0
    ? `Missing server-side Sanity environment variables: ${missing.join(', ')}`
    : null;
}

function getSanityClient() {
  const config = getSanityConfig();

  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: config.useCdn,
    token: config.token,
    ignoreBrowserTokenWarning: true,
  });
}

function getImageBuilder() {
  const config = getSanityConfig();

  return imageUrlBuilder({
    projectId: config.projectId,
    dataset: config.dataset,
  });
}

function buildImageUrl(builder, source) {
  if (!source) {
    return '';
  }

  return builder.image(source).url();
}

function serializePortableText(blocks, builder) {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks.map((block) => {
    if (block?._type !== 'image') {
      return block;
    }

    return {
      ...block,
      imageUrl: buildImageUrl(builder, block.asset),
    };
  });
}

function serializePost(post, builder) {
  return {
    ...post,
    mainImageUrl: buildImageUrl(builder, post.mainImage),
    body: serializePortableText(post.body, builder),
  };
}

function serializePicture(picture, builder) {
  const imageGallery = Array.isArray(picture.imageGallery)
    ? picture.imageGallery.map((image) => ({
        ...image,
        url: buildImageUrl(builder, image.asset),
        thumbnailUrl: buildImageUrl(builder, image.asset),
      }))
    : [];

  return {
    ...picture,
    coverImageUrl: imageGallery[0]?.url || '',
    imageGallery,
  };
}

module.exports = {
  getSanityClient,
  getSanityConfigError,
  getImageBuilder,
  serializePicture,
  serializePost,
};
