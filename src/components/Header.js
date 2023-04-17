import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import logo from '../images/Logo.svg';

function Header({loggedIn, setLoggedIn, email}) {
  const [linkUrl, setLinkUrl]= useState(''),
        [linkText, setLinkText] = useState('');

  const location = useLocation();

  function onSignOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwtToken');
  }

  useEffect(() => {
    if (!loggedIn) {
      if (location.pathname === '/sign-in') {
        setLinkUrl('/sign-up')
        setLinkText('Зарегистрироваться');
      }

      if (location.pathname === '/sign-up') {
        setLinkUrl('/sign-in')
        setLinkText('Войти');
      }
    }

    else {
      setLinkUrl('/sign-in')
      setLinkText('Выйти');
    }
  }, [location.pathname]);

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип"/>
      <div className="header__container">
        {loggedIn && <p className="header_email">{loggedIn && email}</p>}
        <Link
          to={linkUrl}
          className={`header__link ${loggedIn ? 'header__link_logged' : ''}`}
          onClick={onSignOut}
        >
          {`${linkText}`}
        </Link>
      </div>
    </header>
  );
}

export default Header;
