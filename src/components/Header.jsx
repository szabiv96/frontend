import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function Header() {

  const [show, setShow] = useState(false);
  const [animation, setAnimation] = useState(false);

  return (
    <>
      <div className={animation ? "menuAnimation menuButton" : "menuButton"} onClick={() => {
        setShow(!show);
        setAnimation(!animation);
      }}>
        <div className='menuPart01'></div>
        <div className='menuPart02'></div>
        <div className='menuPart03'></div>
      </div>
      <div className={show ? "showMenu nav" : "nav"}>
        <h4><Link to="/">StarterPage</Link></h4>
        <h4>:</h4>
        <h4><Link to="/gallery">CarefullyKept</Link></h4>
        <h4>:</h4>
        <h4><Link to="/quit">Quit</Link></h4>
      </div>
    </>

  )
}
