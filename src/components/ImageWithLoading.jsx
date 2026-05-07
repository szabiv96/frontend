function ImageWithLoading({ src, alt }) {
    return (
        <div className="image-container">
            <img src={src} alt={alt} />
        </div>
    );
}

export default ImageWithLoading;
