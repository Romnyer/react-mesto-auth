import {Link, useLocation} from 'react-router-dom';
import logo from '../images/Logo.svg';

function Header({loggedIn, setLoggedIn, email}) {
  let linkUrl = '',
      linkText = '';

  const location = useLocation(),
        pathname = location.pathname;

  if (pathname !== '/') {
    if (pathname === '/sign-in') {
      linkUrl = '/sign-up';
      linkText = 'Регистрация';
    }

    if (pathname === '/sign-up') {
      linkUrl = '/sign-in';
      linkText = 'Войти';
    }
  }

  else {
    linkUrl = '/sign-in';
    linkText = 'Выйти';
  };

  function onSignOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwtToken');
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип"/>
      <div className="header__container">
        {loggedIn && <p className="header__email">{email}</p>}
        <Link
          to={linkUrl}
          className={`header__link ${loggedIn ? 'header__link_logged' : ''}`}
          onClick={onSignOut}
        >
          {linkText}
        </Link>
      </div>
    </header>
  );
}

export default Header;
