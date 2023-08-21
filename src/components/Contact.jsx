import React, { useEffect, useState } from 'react';

export default function App() {
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const scrollThreshold = 360; // Adjust this value based on how close to the bottom you want to trigger the contacts

      if (pageHeight - scrollPosition < scrollThreshold) {
        setShowContacts(true);
      } else {
        setShowContacts(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='contact'>
      <h2 className={`email ${showContacts ? 'fadeIn' : ''}`}>email: szabi.v96@gmail.com</h2>
      <h2 className={`email ${showContacts ? 'fadeIn' : ''}`}>behance: szabolcsvarga96</h2>
      <h2 className={`email ${showContacts ? 'fadeIn' : ''}`}>insta: @szabolcs.lajos</h2>
    </div>
  );
};
