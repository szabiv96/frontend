import { useMemo } from 'react';
import Album from '../components/Album';

function CarefullyKept({ pictures }) {
  const sortedPictures = useMemo(() => {
    if (!Array.isArray(pictures)) {
      return [];
    }

    return [...pictures].sort((leftPicture, rightPicture) => {
      const leftYear = Number(leftPicture?.year) || 0;
      const rightYear = Number(rightPicture?.year) || 0;

      if (rightYear !== leftYear) {
        return rightYear - leftYear;
      }

      return (rightPicture?._updatedAt || '').localeCompare(leftPicture?._updatedAt || '');
    });
  }, [pictures]);

  if (!Array.isArray(pictures) || pictures.length === 0) {
    return (
      <div className='statusScreen'>
        <div className='statusCard'>
          <h2>No artworks found</h2>
          <p>The shared bootstrap request did not return any picture collections.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='background01'></div>
      <div className='aboutCollections'>
        <h1>Carefully kept...</h1>
        <p>
          Az a sok minden, amibe belekezdek vagy épp folytatom és újra előveszem az mind megtalálhat
          itt gondosan válogatva, jól elrakva és összecsomagolva.
        </p>
      </div>
      <div className='albumContainer margin-02'>
        {sortedPictures.map((picture, idx) => (
          <Album
            key={picture._id || idx}
            collectionName={picture.collectionName}
            picture={picture.coverImageUrl}
            description={picture.description}
            details={picture}
          />
        ))}
      </div>
    </>
  );
}

export default CarefullyKept;
