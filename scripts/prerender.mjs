import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const {
  getImageBuilder,
  getSanityClient,
  getSanityConfigError,
  getSiteUrl,
  serializePicture,
  serializePost,
} = require('../api/_sanity.js');

const SITE_NAME = 'They made me do it!';
const SITE_TITLE = 'Varga Szabolcs Lajos Artist Portfolio';
const SITE_DESCRIPTION =
  'Portfolio of Varga Szabolcs Lajos featuring artworks, collections, essays, and exhibition history.';
const DEFAULT_OG_IMAGE = '/img/landingPagePic02.png';
const DEFAULT_LOCAL_SITE_URL = 'http://localhost:4173';

function truncateText(text, maxLength = 160) {
  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function portableTextToPlainText(blocks) {
  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .flatMap((block) => (Array.isArray(block?.children) ? block.children.map((child) => child?.text || '') : []))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildPageTitle(pageTitle) {
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_TITLE;
}

function sortPosts(posts) {
  return [...posts].sort((leftPost, rightPost) => {
    const leftDate = new Date(leftPost?.publishedAt || leftPost?._createdAt || 0).getTime();
    const rightDate = new Date(rightPost?.publishedAt || rightPost?._createdAt || 0).getTime();

    return rightDate - leftDate;
  });
}

function sortPictures(pictures) {
  return [...pictures].sort((leftPicture, rightPicture) => {
    const leftYear = Number(leftPicture?.year) || 0;
    const rightYear = Number(rightPicture?.year) || 0;

    if (rightYear !== leftYear) {
      return rightYear - leftYear;
    }

    return (rightPicture?._updatedAt || '').localeCompare(leftPicture?._updatedAt || '');
  });
}

function toAbsoluteUrl(siteUrl, url) {
  if (!url) {
    return `${siteUrl}${DEFAULT_OG_IMAGE}`;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function serializeForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/<\/script/gi, '<\\/script');
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function upsertTitle(html, title) {
  const tag = `<title>${escapeAttribute(title)}</title>`;

  return replaceTag(html, /<title>[\s\S]*?<\/title>/i, tag);
}

function upsertMeta(html, attribute, key, content) {
  const tag = `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`;
  const pattern = new RegExp(`<meta\\b[^>]*\\b${attribute}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i');

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace('</head>', `  ${tag}\n</head>`);
}

function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeAttribute(href)}" />`;
  const pattern = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i;

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace('</head>', `  ${tag}\n</head>`);
}

function upsertStructuredData(html, structuredData) {
  if (!structuredData) {
    return html;
  }

  const tag = `  <script type="application/ld+json">${serializeForScript(structuredData)}</script>\n</head>`;

  return html.replace('</head>', tag);
}

function injectRenderedApp(html, appHtml, initialData) {
  const appTag = `<div id="root">${appHtml}</div>`;
  const payloadTag = `<script>window.__INITIAL_DATA__ = ${serializeForScript(initialData)};</script>`;

  return html.replace('<div id="root"></div>', `${appTag}\n    ${payloadTag}`);
}

function applySeo(html, seo) {
  let nextHtml = upsertTitle(html, seo.title);

  nextHtml = upsertMeta(nextHtml, 'name', 'description', seo.description);
  nextHtml = upsertMeta(nextHtml, 'name', 'robots', 'index, follow');
  nextHtml = upsertMeta(nextHtml, 'property', 'og:title', seo.title);
  nextHtml = upsertMeta(nextHtml, 'property', 'og:description', seo.description);
  nextHtml = upsertMeta(nextHtml, 'property', 'og:type', seo.type || 'website');
  nextHtml = upsertMeta(nextHtml, 'property', 'og:site_name', SITE_NAME);
  nextHtml = upsertMeta(nextHtml, 'property', 'og:url', seo.canonicalUrl);
  nextHtml = upsertMeta(nextHtml, 'property', 'og:image', seo.image);
  nextHtml = upsertMeta(nextHtml, 'name', 'twitter:card', 'summary_large_image');
  nextHtml = upsertMeta(nextHtml, 'name', 'twitter:title', seo.title);
  nextHtml = upsertMeta(nextHtml, 'name', 'twitter:description', seo.description);
  nextHtml = upsertMeta(nextHtml, 'name', 'twitter:image', seo.image);
  nextHtml = upsertCanonical(nextHtml, seo.canonicalUrl);
  nextHtml = upsertStructuredData(nextHtml, seo.structuredData);

  return nextHtml;
}

function getRouteFilePath(routePath) {
  if (routePath === '/') {
    return path.resolve('build/index.html');
  }

  return path.resolve('build', routePath.slice(1), 'index.html');
}

async function loadServerRenderer() {
  const buildSsrDir = path.resolve('build-ssr');
  const files = await fs.readdir(buildSsrDir);
  const entryFile = files.find((file) => /^entry-server\.(mjs|js|cjs)$/.test(file));

  if (!entryFile) {
    throw new Error('Could not find the SSR entry output in build-ssr.');
  }

  return import(pathToFileURL(path.join(buildSsrDir, entryFile)).href);
}

function buildRouteSeo(routePath, initialData, siteUrl) {
  const sortedPosts = sortPosts(initialData.posts);
  const sortedPictures = sortPictures(initialData.pictures);
  const cvData = initialData.cvDatas[0] || {};
  const canonicalUrl = `${siteUrl}${routePath === '/' ? '' : routePath}`;

  if (routePath === '/') {
    return {
      title: buildPageTitle('Home'),
      description: SITE_DESCRIPTION,
      image: toAbsoluteUrl(siteUrl, DEFAULT_OG_IMAGE),
      canonicalUrl,
      type: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Varga Szabolcs Lajos',
        jobTitle: 'Artist',
        description: SITE_DESCRIPTION,
        image: toAbsoluteUrl(siteUrl, DEFAULT_OG_IMAGE),
        url: canonicalUrl,
        sameAs: [
          'https://www.instagram.com/szabolcs.lajos/',
          'https://www.behance.net/szabolcsvarga96',
        ],
      },
    };
  }

  if (routePath === '/gallery') {
    return {
      title: buildPageTitle('Gallery'),
      description: truncateText(
        'Carefully kept artworks, collections, and visual projects by Varga Szabolcs Lajos.',
        160
      ),
      image: toAbsoluteUrl(siteUrl, sortedPictures[0]?.coverImageUrl || DEFAULT_OG_IMAGE),
      canonicalUrl,
      type: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Carefully kept artworks',
        description: 'Artwork collections and visual projects by Varga Szabolcs Lajos.',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: sortedPictures.map((picture, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: picture.collectionName,
            url: `${siteUrl}/gallery/${picture._id}`,
          })),
        },
      },
    };
  }

  if (routePath.startsWith('/gallery/')) {
    const pictureId = routePath.slice('/gallery/'.length);
    const picture = initialData.pictures.find((item) => item._id === pictureId);
    const images = picture?.imageGallery || [];

    return {
      title: buildPageTitle(picture?.collectionName || 'Gallery'),
      description: truncateText(
        picture?.description || 'Artwork collection by Varga Szabolcs Lajos.',
        160
      ),
      image: toAbsoluteUrl(siteUrl, picture?.coverImageUrl || images[0]?.url || DEFAULT_OG_IMAGE),
      canonicalUrl,
      type: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: picture?.collectionName || 'Artwork collection',
        description: picture?.description || 'Artwork collection by Varga Szabolcs Lajos.',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: images.map((image, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'VisualArtwork',
              name: image.title || picture?.collectionName || `Artwork ${index + 1}`,
              image: toAbsoluteUrl(siteUrl, image.url || DEFAULT_OG_IMAGE),
              artMedium: image.eng_media || image.media || undefined,
              dateCreated: image.year || undefined,
            },
          })),
        },
      },
    };
  }

  if (routePath === '/quit') {
    const firstPost = sortedPosts[0];

    return {
      title: buildPageTitle('Quit'),
      description: truncateText(
        'Current thoughts, essays, and art critique by Varga Szabolcs Lajos.',
        160
      ),
      image: toAbsoluteUrl(siteUrl, firstPost?.mainImageUrl || DEFAULT_OG_IMAGE),
      canonicalUrl,
      type: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Quit',
        description: 'Current thoughts, essays, and art critique by Varga Szabolcs Lajos.',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: sortedPosts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: `${siteUrl}/quit/${post._rev}`,
          })),
        },
      },
    };
  }

  if (routePath.startsWith('/quit/')) {
    const postRev = routePath.slice('/quit/'.length);
    const post = initialData.posts.find((item) => item._rev === postRev);
    const description = truncateText(portableTextToPlainText(post?.body), 160);
    const author = initialData.authors.find((item) => item._id === post?.author?._ref);

    return {
      title: buildPageTitle(post?.title || 'Post'),
      description: description || SITE_DESCRIPTION,
      image: toAbsoluteUrl(siteUrl, post?.mainImageUrl || DEFAULT_OG_IMAGE),
      canonicalUrl,
      type: 'article',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post?.title || 'Post',
        description: description || SITE_DESCRIPTION,
        image: toAbsoluteUrl(siteUrl, post?.mainImageUrl || DEFAULT_OG_IMAGE),
        datePublished: post?.publishedAt || post?._createdAt || undefined,
        dateModified: post?._updatedAt || post?.publishedAt || post?._createdAt || undefined,
        author: {
          '@type': 'Person',
          name: author?.name || 'Varga Szabolcs Lajos',
        },
        mainEntityOfPage: canonicalUrl,
      },
    };
  }

  if (routePath === '/cv') {
    const educations = cvData.educations || [];
    const primaryInstitution = educations[0]?.inst;
    const description = primaryInstitution
      ? `CV of Varga Szabolcs Lajos featuring exhibitions, education history, and projects, including studies at ${primaryInstitution}.`
      : 'CV of Varga Szabolcs Lajos featuring exhibitions, education history, and projects.';

    return {
      title: buildPageTitle('CV, Education and Exhibitions'),
      description,
      image: toAbsoluteUrl(siteUrl, DEFAULT_OG_IMAGE),
      canonicalUrl,
      type: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Varga Szabolcs Lajos',
        jobTitle: 'Artist',
        url: canonicalUrl,
        alumniOf: educations
          .filter((education) => education?.inst)
          .map((education) => ({
            '@type': 'CollegeOrUniversity',
            name: education.inst,
            department: education.department || undefined,
          })),
      },
    };
  }

  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    image: toAbsoluteUrl(siteUrl, DEFAULT_OG_IMAGE),
    canonicalUrl,
    type: 'website',
  };
}

async function main() {
  const configError = getSanityConfigError();

  if (configError) {
    console.warn(`Skipping prerender: ${configError}`);
    return;
  }

  const templatePath = path.resolve('build/index.html');
  const template = await fs.readFile(templatePath, 'utf8');
  const { render } = await loadServerRenderer();
  const client = getSanityClient();
  const imageBuilder = getImageBuilder();
  const siteUrl = getSiteUrl() || DEFAULT_LOCAL_SITE_URL;

  if (!getSiteUrl()) {
    console.warn(`Using ${DEFAULT_LOCAL_SITE_URL} for prerender because SITE_URL is not set.`);
  }

  const [posts, cvDatas, pictures, authors] = await Promise.all([
    client.fetch('*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc)'),
    client.fetch('*[_type == "cv"]'),
    client.fetch('*[_type == "pictures"] | order(_updatedAt desc)'),
    client.fetch('*[_type == "author"]'),
  ]);

  const initialData = {
    posts: posts.map((post) => serializePost(post, imageBuilder)),
    cvDatas,
    pictures: pictures.map((picture) => serializePicture(picture, imageBuilder)),
    authors,
  };

  const routes = [
    '/',
    '/gallery',
    '/quit',
    '/cv',
    ...initialData.pictures
      .filter((picture) => picture?._id)
      .map((picture) => `/gallery/${picture._id}`),
    ...initialData.posts
      .filter((post) => post?._rev)
      .map((post) => `/quit/${post._rev}`),
  ];

  await Promise.all(
    routes.map(async (routePath) => {
      const routeHtml = render(routePath, initialData);
      const routeSeo = buildRouteSeo(routePath, initialData, siteUrl);
      const routeDocument = applySeo(injectRenderedApp(template, routeHtml, initialData), routeSeo);
      const outputFilePath = getRouteFilePath(routePath);

      await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
      await fs.writeFile(outputFilePath, routeDocument, 'utf8');
    })
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
