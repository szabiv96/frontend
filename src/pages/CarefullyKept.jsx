import Album from '../components/Album';

function CarefullyKept({ pictures }) {


  if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
    return <div className='loading'>
      <p>Loading ... </p>
    </div> // Render a loading message or alternative content
  }
  

  /* console.log(pictures); */

  return (
    <>
      <div className='background01'></div>
      <div className='aboutCollections'>
        <h1>Carefully kept...</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa excepturi obcaecati placeat cumque laudantium dignissimos, maiores enim dolore hic esse numquam voluptates suscipit nobis itaque aperiam voluptas. Amet porro, assumenda nesciunt quisquam distinctio ex incidunt, alias harum est ea cupiditate?
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
