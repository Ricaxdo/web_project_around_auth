import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/aroundEEUU_logo.svg';
import menuIcon from '../../images/menu.png';

export default function Header({ isLoggedIn, userEmail, onSignOut }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detectar rutas públicas
  const isLoginPage = location.pathname === '/signin';
  const isRegisterPage = location.pathname === '/signup';

  // Texto dinámico para las páginas públicas
  let linkText = '';
  let linkTo = '';

  if (isLoginPage) {
    linkText = 'Regístrate';
    linkTo = '/signup';
  } else if (isRegisterPage) {
    linkText = 'Inicia sesión';
    linkTo = '/signin';
  }

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    onSignOut();
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__left">
            <img className="header__logo" src={logo} alt="Logotipo Around the US" />
          </div>

          <div className="header__right">
            {/* Rutas públicas (signin / signup) cuando NO está logueado */}
            {!isLoggedIn && (isLoginPage || isRegisterPage) && (
              <p className="header__caption">
                <Link to={linkTo} className="header__link">
                  {linkText}
                </Link>
              </p>
            )}

            {/* Usuario logueado */}
            {isLoggedIn && (
              <>
                <div className="header__user-info">
                  <p className="header__email">{userEmail}</p>
                  <button className="header__logout" onClick={onSignOut}>
                    Cerrar sesión
                  </button>
                </div>

                <button
                  className="header__menu-button"
                  type="button"
                  aria-label="Abrir menú"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  <img src={menuIcon} alt="Menú" className="header__menu-icon" />
                </button>
              </>
            )}
          </div>
        </div>
        {(!isLoggedIn || (isLoggedIn && !isMenuOpen)) && <div className="header__divider" />}{' '}
      </header>

      {/* Barra desplegable bajo el header en mobile */}
      {isLoggedIn && isMenuOpen && (
        <div className="headerMenuBar">
          <p className="headerMenuBar__email">{userEmail}</p>
          <button className="headerMenuBar__logout" onClick={handleLogoutClick}>
            Cerrar sesión
          </button>
        </div>
      )}
    </>
  );
}
