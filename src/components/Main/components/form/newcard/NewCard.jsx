import { useEffect } from 'react';
import { useFormValidation } from '../../../../../hooks/useFormValidation';

export default function NewCard({ onAddNewCard, isSaving, onClose }) {
  const { values, errors, isValid, handleChange, resetForm } = useFormValidation({
    title: '',
    link: '',
  });

  useEffect(() => {
    resetForm({ title: '', link: '' }, {}, false);
  }, [resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || !onAddNewCard) return;

    const payload = {
      title: values.title.trim(),
      link: values.link.trim(),
    };

    onAddNewCard(payload)
      .then(() => {
        resetForm({ title: '', link: '' }, {}, false);
        onClose?.();
      })
      .catch((err) => {
        console.error('Error al crear tarjeta:', err);
      });
  };

  const titleError = errors.title;
  const linkError = errors.link;

  const titleInputClass = `addPopup__input addPopup__input-title ${
    titleError ? 'addPopup__input-type-error' : values.title ? 'addPopup__input-type-valid' : ''
  }`;

  const linkInputClass = `addPopup__input addPopup__input-link ${
    linkError ? 'addPopup__input-type-error' : values.link ? 'addPopup__input-type-valid' : ''
  }`;

  const submitButtonClass = `addPopup__submit-button ${
    !isValid || isSaving ? 'addPopup__submit-button_disabled' : ''
  }`;

  return (
    <form className="addPopup__form" noValidate onSubmit={handleSubmit}>
      <input
        id="input-title"
        type="text"
        name="title"
        className={titleInputClass}
        placeholder="Titulo"
        required
        minLength={2}
        maxLength={30}
        value={values.title}
        onChange={handleChange}
      />
      <span
        className={`addPopup__input-error input-title-error ${
          titleError ? 'addPopup__input-error_active' : ''
        }`}
      >
        {titleError || 'Por favor, rellena este campo'}
      </span>

      <input
        id="input-url"
        type="url"
        name="link"
        className={linkInputClass}
        placeholder="Enlace de la imagen"
        required
        value={values.link}
        onChange={handleChange}
      />
      <span
        className={`addPopup__input-error input-url-error ${
          linkError ? 'addPopup__input-error_active' : ''
        }`}
      >
        {linkError || 'Por favor, rellena este campo'}
      </span>

      <button className={submitButtonClass} type="submit" disabled={!isValid || isSaving}>
        {isSaving ? 'Creando...' : 'Crear'}
      </button>
    </form>
  );
}
