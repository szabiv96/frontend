import React, { useEffect } from 'react'

export default function Footer() {

    useEffect(() => {
        const handleScroll2 = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            const scrollThreshold = 360;
    
            if(pageHeight - scrollPosition < scrollThreshold) {
                console.log("hello world");
            }
        }

        console.log(document.querySelector(".landingIMG"));

        const newDivStyle = {
            display: none,
        };

        window.addEventListener('scroll', handleScroll2);

        return () => {
            window.removeEventListener('scroll', handleScroll2);
        }

    }, []);

    return (
        <div className='footer'>
            hey
        </div>
    )
}
