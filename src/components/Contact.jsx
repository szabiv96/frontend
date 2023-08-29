import React, { useEffect, useState } from 'react';

export default function App() {
  const [showContacts, setShowContacts] = useState(false);
  const [crossed, setCrossed] = useState(false);
  const [scrollThreshold, setScrollThreshold] = useState(0.1); // Default threshold as a percentage

  useEffect(() => {
    const calculatedThreshold = document.documentElement.scrollHeight * 0.1; // 10% of the page height
    setScrollThreshold(calculatedThreshold);

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const targetDiv = document.querySelector('.landingIMG');

      if (pageHeight - scrollPosition < scrollThreshold) {
        setShowContacts(true);

        if (targetDiv) {
          targetDiv.classList.remove("moveBackPic");
          targetDiv.classList.add("movePic");
          setCrossed(true);
        }
      } else {
        if (targetDiv && crossed) {
          targetDiv.classList.remove("movePic");
          targetDiv.classList.add("moveBackPic");
          setShowContacts(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [crossed, scrollThreshold]);

  return (
    <div className='contact'>
      <h2 className={`email ${showContacts ? 'fadeIn' : ''}`}>email: szabi.v96@gmail.com</h2>
      <h2 className={`email ${showContacts ? 'fadeIn' : ''}`}>behance: szabolcsvarga96</h2>
      <h2 className={`email ${showContacts ? 'fadeIn' : ''}`}>insta: @szabolcs.lajos</h2>
    </div>
  );
};
