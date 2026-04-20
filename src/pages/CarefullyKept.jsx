import Album from '../components/Album';

function CarefullyKept({ pictures }) {
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
        {pictures.map((picture, idx) => (
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
