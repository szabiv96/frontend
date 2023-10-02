import React, { useState } from 'react'

export default function Header() {

  const [show, setShow] = useState(false);
  const [animation, setAnimation] = useState(false);

  return (
    <>
      <div className={animation ? "menuAnimation menuButton" : "menuButton"} onClick={() => {
        console.log("hello there");
        setShow(!show);
        setAnimation(!animation);
      }}>
        <div className='menuPart01'></div>
        <div className='menuPart02'></div>
        <div className='menuPart03'></div>
      </div>
      <div className={show ? "showMenu nav" : "nav"}>
        <h4><a href="/">StarterPage</a></h4>
        <h4>:</h4>
        <h4><a href='/gallery'>CarefullyKept</a></h4>
        <h4>:</h4>
        <h4><a href='/quit'>Quit</a></h4>
      </div>
    </>

  )
}
