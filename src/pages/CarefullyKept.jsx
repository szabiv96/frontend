import Album from '../components/Album';

function CarefullyKept({ pictures }) {


  if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
    return <div className='loading'>
      <p>Loading ... </p>
    </div> // Render a loading message or alternative content
  }
  

  console.log(pictures);

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
        {
          pictures.map((picture, idx) => (
            <Album
              key={idx}
              collectionName={picture.collectionName}
              picture={picture.imageGallery[0].asset._ref}
              description={picture.description}
              details={picture}
            />
          ))
        }
      </div>
    </>
  );
}

export default CarefullyKept;
