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
          Itt találhatóak tematikusan összerendezve az eddig készült alkotásaim. Multimediális művésznek tartom magam, mivel különböző médiumokat használok.
          Különböző műfajú és tecchnikával készült sorozatokat rövid leírásokkal láttam el. A műalkotásokkal kapcsolatban olvashatók blog bejegyzések a Quit menüpontban.
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
