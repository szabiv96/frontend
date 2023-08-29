import React, { useEffect, useState } from 'react';

export default function App() {
    const [showFooter, setShowFooter] = useState(false);
    const [scrollThreshold, setScrollThreshold] = useState(0.1); // Default threshold as a percentage

    useEffect(() => {
        // Calculate the scroll threshold as a percentage of the page height
        const calculatedThreshold = document.documentElement.scrollHeight * 0.1; // 10% of the page height
        setScrollThreshold(calculatedThreshold);

        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const targetDiv = document.querySelector('.footer');

            // First, check if there's no scrollbar by comparing pageHeight and viewportHeight
            if (pageHeight <= viewportHeight) {
                if (targetDiv) {
                    targetDiv.classList.remove("footerHide");
                    targetDiv.classList.add("footerShow");
                }
                setShowFooter(true);
            } else if (pageHeight - scrollPosition < scrollThreshold) {
                if (targetDiv) {
                    targetDiv.classList.remove("footerHide");
                    targetDiv.classList.add("footerShow");
                }
                setShowFooter(true);
            } else {
                if (targetDiv && showFooter) {
                    targetDiv.classList.remove("footerShow");
                    targetDiv.classList.add("footerHide");
                }
                setShowFooter(false);
            }

            if (window.innerHeight === window.screen.height) {
                targetDiv.classList.remove("footerShow");
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showFooter, scrollThreshold]);

    return (
        <div className='footer'>
            <div className='credits'>
                ©2023 Varga Szabolcs Lajos, All rights reserved.
            </div>
        </div>
    );
};
