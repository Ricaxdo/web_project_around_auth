import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(form.email, form.password);
  }

  return (
    <section className="auth">
      <h2 className="auth__title">Inicia sesión</h2>

      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="auth__password-wrapper">
          <input
            className="auth__input auth__input--password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="auth__toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <button className="auth__submit-button" type="submit">
          Iniciar sesión
        </button>
      </form>

      <p className="auth__caption">
        ¿Aún no eres miembro?{' '}
        <Link to="/signup" className="auth__link">
          Regístrate aquí
        </Link>
      </p>
    </section>
  );
}

export default Login;
