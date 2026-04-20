import { useEffect, useState } from 'react';

function ImageWithLoading({ src, alt }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(Boolean(src));
    }, [src]);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
    };

    return (
        <div className={`image-container ${isLoading ? 'loading' : ''}`}>
            {isLoading && <div className="loading-animation"></div>}
            <img
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={isLoading ? 'hidden' : 'visible'}
            />
        </div>
    );
}

export default ImageWithLoading;
