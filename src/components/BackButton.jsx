import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // This will navigate back to the previous page or location.
    };

    return (
        <div className='backButton' onClick={handleGoBack}>back</div>
    );
}

export default BackButton;