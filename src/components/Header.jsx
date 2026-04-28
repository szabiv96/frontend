import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setShow(false);
    setAnimation(false);
  }, [pathname]);

  const toggleMenu = () => {
    setShow((currentValue) => !currentValue);
    setAnimation((currentValue) => !currentValue);
  };

  return (
    <>
      <div className={animation ? "menuAnimation menuButton" : "menuButton"} onClick={toggleMenu}>
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
        <h4>:</h4>
        <h4><a href="/projects/gallery-d0428">Game</a></h4>
      </div>
    </>
  );
}
