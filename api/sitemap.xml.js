const { getSanityClient, getSanityConfigError, getSiteUrl } = require('./_sanity');

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildUrlEntry(url, lastModified) {
  const updatedAt = lastModified ? `<lastmod>${escapeXml(lastModified)}</lastmod>` : '';

  return `<url><loc>${escapeXml(url)}</loc>${updatedAt}</url>`;
}

function getRequestSiteUrl(req) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  if (!host) {
    return '';
  }

  return `${forwardedProto || 'https'}://${host}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const configError = getSanityConfigError();

  if (configError) {
    res.status(500).send(configError);
    return;
  }

  try {
    const client = getSanityClient();
    const siteUrl = getSiteUrl() || getRequestSiteUrl(req);
    const [posts, pictures] = await Promise.all([
      client.fetch('*[_type == "post"]{_rev, publishedAt, _updatedAt, _createdAt}'),
      client.fetch('*[_type == "pictures"]{_id, _updatedAt}'),
    ]);

    const staticRoutes = [
      { path: '/', lastModified: null },
      { path: '/gallery', lastModified: pictures[0]?._updatedAt || null },
      { path: '/quit', lastModified: posts[0]?._updatedAt || posts[0]?.publishedAt || null },
      { path: '/cv', lastModified: null },
    ];

    const dynamicPostRoutes = posts
      .filter((post) => post?._rev)
      .map((post) => ({
        path: `/quit/${post._rev}`,
        lastModified: post._updatedAt || post.publishedAt || post._createdAt || null,
      }));

    const dynamicPictureRoutes = pictures
      .filter((picture) => picture?._id)
      .map((picture) => ({
        path: `/gallery/${picture._id}`,
        lastModified: picture._updatedAt || null,
      }));

    const allRoutes = [...staticRoutes, ...dynamicPostRoutes, ...dynamicPictureRoutes];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map((route) => `  ${buildUrlEntry(`${siteUrl}${route.path}`, route.lastModified)}`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).send('Failed to generate sitemap');
  }
};
