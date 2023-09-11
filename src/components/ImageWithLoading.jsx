import React, { useState } from 'react';

function ImageWithLoading({ src, alt }) {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={`image-container ${isLoading ? 'loading' : ''}`}>
            {isLoading && <div className="loading-animation"></div>}
            <img
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                className={isLoading ? 'hidden' : 'visible'}
            />
        </div>
    );
}

export default ImageWithLoading;
