export function formatContentDate(dateValue, { includeTime = true } = {}) {
  if (!dateValue) {
    return 'Publication Date Missing';
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Publication Date Missing';
  }

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime
      ? {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }
      : {}),
  }).format(parsedDate);
}

export function findAuthor(authors, authorRef) {
  if (!Array.isArray(authors) || !authorRef) {
    return null;
  }

  return authors.find((author) => author._id === authorRef) || null;
}
