import { useEffect } from 'react';
import {
  buildPageTitle,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TITLE,
  toAbsoluteUrl,
} from '../utils/seo';

function ensureMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) {
      element.setAttribute(key, value);
    }
  });
}

function ensureLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function ensureJsonLd(id, data) {
  let element = document.head.querySelector(`script[data-seo-id="${id}"]`);

  if (!data) {
    if (element) {
      element.remove();
    }
    return;
  }

  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.setAttribute('data-seo-id', id);
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export default function Seo({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  structuredData,
}) {
  useEffect(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const resolvedImage = toAbsoluteUrl(image || DEFAULT_OG_IMAGE);
    const resolvedTitle = buildPageTitle(title) || SITE_TITLE;

    document.title = resolvedTitle;

    ensureMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    });
    ensureMeta('meta[name="robots"]', {
      name: 'robots',
      content: 'index,follow',
    });
    ensureMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: resolvedTitle,
    });
    ensureMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    ensureMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    });
    ensureMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: currentUrl,
    });
    ensureMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_NAME,
    });
    ensureMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: resolvedImage,
    });
    ensureMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    ensureMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: resolvedTitle,
    });
    ensureMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    ensureMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: resolvedImage,
    });

    if (currentUrl) {
      ensureLink('canonical', currentUrl);
    }

    ensureJsonLd('page-structured-data', structuredData);
  }, [title, description, image, type, structuredData]);

  return null;
}
