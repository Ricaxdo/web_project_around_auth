import { useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import { useFormValidation } from '../../../../../hooks/useFormValidation';

export default function EditProfile({ onClose, isSaving }) {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext) ?? {};

  const { values, errors, isValid, handleChange, resetForm } = useFormValidation({
    name: currentUser?.name || '',
    about: currentUser?.about || '',
  });

  useEffect(() => {
    if (currentUser) {
      resetForm({ name: currentUser.name || '', about: currentUser.about || '' }, {}, true);
    }
  }, [currentUser, resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || !handleUpdateUser) return;

    const payload = {
      name: values.name.trim(),
      about: values.about.trim(),
    };

    handleUpdateUser(payload)
      .then(() => {
        onClose?.();
      })
      .catch((err) => {
        console.error('Error al actualizar perfil:', err);
      });
  };

  const nameError = errors.name;
  const aboutError = errors.about;

  const nameInputClass = `editPopup__input editPopup__input-name ${
    nameError ? 'editPopup__input-type-error' : values.name ? 'editPopup__input-type-valid' : ''
  }`;

  const aboutInputClass = `editPopup__input editPopup__input-about ${
    aboutError ? 'editPopup__input-type-error' : values.about ? 'editPopup__input-type-valid' : ''
  }`;

  const submitButtonClass = `editPopup__submit-button ${
    !isValid || isSaving ? 'editPopup__submit-button_disabled' : ''
  }`;

  return (
    <form className="editPopup__form" noValidate onSubmit={handleSubmit}>
      {/* ---------------- NAME ---------------- */}
      <input
        id="input-name"
        type="text"
        name="name"
        className={nameInputClass}
        placeholder="Nombre"
        required
        minLength={2}
        maxLength={40}
        value={values.name}
        onChange={handleChange}
      />
      <span
        className={`editPopup__input-error input-name-error ${
          nameError ? 'editPopup__input-error_active' : ''
        }`}
      >
        {nameError || 'Por favor, rellena este campo'}
      </span>

      {/* ---------------- ABOUT ---------------- */}
      <input
        id="input-about"
        type="text"
        name="about"
        className={aboutInputClass}
        placeholder="Acerca de mí"
        required
        minLength={2}
        maxLength={300}
        value={values.about}
        onChange={handleChange}
      />
      <span
        className={`editPopup__input-error input-about-error ${
          aboutError ? 'editPopup__input-error_active' : ''
        }`}
      >
        {aboutError || 'Por favor, rellena este campo'}
      </span>

      {/* ------------ SUBMIT BUTTON ------------ */}
      <button type="submit" className={submitButtonClass} disabled={!isValid || isSaving}>
        {isSaving ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
