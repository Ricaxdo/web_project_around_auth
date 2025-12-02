import { useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import { useFormValidation } from '../../../../../hooks/useFormValidation';

export default function EditAvatar({ onClose, isSaving }) {
  const { handleUpdateAvatar } = useContext(CurrentUserContext) ?? {};

  const { values, errors, isValid, handleChange, resetForm } = useFormValidation({ avatar: '' });

  useEffect(() => {
    resetForm({ avatar: '' }, {}, false);
  }, [resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || !handleUpdateAvatar) return;

    const payload = { avatar: values.avatar.trim() };

    handleUpdateAvatar(payload)
      .then(() => {
        onClose?.();
      })
      .catch((err) => {
        console.error('Error al actualizar avatar:', err);
      });
  };

  const avatarError = errors.avatar;

  const avatarInputClass = `avatarPopup__input ${
    avatarError
      ? 'avatarPopup__input-type-error'
      : values.avatar
        ? 'avatarPopup__input-type-valid'
        : ''
  }`;

  const submitButtonClass = `avatarPopup__submit-button ${
    !isValid || isSaving ? 'avatarPopup__submit-button_disabled' : ''
  }`;

  return (
    <form className="avatarPopup__form" noValidate onSubmit={handleSubmit}>
      <input
        id="input-avatar"
        type="url"
        name="avatar"
        className={avatarInputClass}
        placeholder="Enlace de tu imagen de perfil"
        required
        value={values.avatar}
        onChange={handleChange}
      />
      <span
        className={`avatarPopup__input-error input-avatar-error ${
          avatarError ? 'avatarPopup__input-error_active' : ''
        }`}
      >
        {avatarError || 'Por favor, rellena este campo'}
      </span>

      <button className={submitButtonClass} type="submit" disabled={!isValid || isSaving}>
        {isSaving ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
