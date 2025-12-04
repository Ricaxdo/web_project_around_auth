import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return; // No enviamos si no coincide
    }

    onRegister(form.email, form.password);
  }

  const passwordsMatch =
    form.password.length > 0 &&
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  return (
    <section className="auth">
      <h2 className="auth__title">Regístrate</h2>

      <form className="auth__form" onSubmit={handleSubmit}>
        {/* Email */}
        <input
          className="auth__input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
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

        {/* Confirm Password */}
        <div className="auth__password-wrapper">
          <input
            className="auth__input auth__input--password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="auth__toggle-password"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {/* Error de validación */}
        {form.confirmPassword.length > 0 && !passwordsMatch && (
          <p className="auth__error">Las contraseñas no coinciden</p>
        )}

        <button className="auth__submit-register" type="submit" disabled={!passwordsMatch}>
          Registrate
        </button>
      </form>

      <p className="auth__caption">
        ¿Ya eres miembro?{' '}
        <Link to="/signin" className="auth__link">
          Inicia sesión aquí
        </Link>
      </p>
    </section>
  );
}

export default Register;
