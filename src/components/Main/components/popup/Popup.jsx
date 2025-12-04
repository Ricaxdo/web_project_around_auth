import { useEffect } from 'react';
import closeIcon from '../../../../images/close_icon.png';

export default function Popup({ onClose, title, children, variant }) {
  const isImagePopup = variant === 'imagePopup';

  const containerClass = isImagePopup ? 'imagePopup__container' : 'popup__container';

  // 👉 combinamos clase base + variante
  const closeButtonClass = isImagePopup
    ? 'imagePopup__close-button'
    : variant
      ? `popup__close-button ${variant}__close-button`
      : 'popup__close-button';

  const closeIconClass = isImagePopup
    ? 'imagePopup__close-button-icon'
    : variant
      ? `popup__close-button-icon ${variant}__close-button-icon`
      : 'popup__close-button-icon';

  // CERRAR CON ESC
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscClose);
    return () => document.removeEventListener('keydown', handleEscClose);
  }, [onClose]);

  return (
    <div className={`popup ${variant || ''} popup_opened`} role="dialog" aria-modal="true">
      <div className={containerClass}>
        {!isImagePopup && (
          <div className="popup__content">
            {title && <h2 className={variant ? `${variant}__title` : 'popup__title'}>{title}</h2>}
            {children}
          </div>
        )}

        {isImagePopup && children}

        <button
          className={closeButtonClass}
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
        >
          <img src={closeIcon} alt="Cerrar" className={closeIconClass} />
        </button>
      </div>
    </div>
  );
}
