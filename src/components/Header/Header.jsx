import logo from '../../images/aroundEEUU_logo.svg';

export default function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Logotipo de Minecraft" />
      <div className="header__divider"></div>
    </header>
  );
}
