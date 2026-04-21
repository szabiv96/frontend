export const SITE_NAME = 'They made me do it!';
export const SITE_TITLE = 'Varga Szabolcs Lajos Artist Portfolio';
export const SITE_DESCRIPTION =
  'Portfolio of Varga Szabolcs Lajos featuring artworks, collections, essays, and exhibition history.';
export const DEFAULT_OG_IMAGE = '/img/landingPagePic02.png';

export function buildPageTitle(pageTitle) {
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_TITLE;
}

export function toAbsoluteUrl(url) {
  if (!url) {
    return '';
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (typeof window !== 'undefined') {
    return new URL(url, window.location.origin).toString();
  }

  return url;
}

export function portableTextToPlainText(blocks) {
  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .flatMap((block) => (Array.isArray(block?.children) ? block.children.map((child) => child?.text || '') : []))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateText(text, maxLength = 160) {
  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}…`;
}

export function buildArtworkAltText(artwork, fallback = 'Artwork image') {
  if (!artwork) {
    return fallback;
  }

  const parts = [
    artwork.title,
    artwork.collectionName,
    artwork.year,
    artwork.eng_media || artwork.media,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : fallback;
}
