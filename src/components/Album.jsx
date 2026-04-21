import { Link } from 'react-router-dom';
import ImageWithLoading from './ImageWithLoading';
import { buildArtworkAltText } from '../utils/seo';

export default function Album({ details, collectionName, picture }) {
  return (
    <div className='album'>
      <div className='image-container'>
        <Link to={`/gallery/${details._id}`}>
          <div className='decor'>
            <div className='inside'>
              <h1>{collectionName}</h1>
            </div>
          </div>
          <ImageWithLoading
            src={picture || ''}
            alt={buildArtworkAltText(details, `${collectionName} collection cover`)}
          />
        </Link>
      </div>
    </div>
  )
}
