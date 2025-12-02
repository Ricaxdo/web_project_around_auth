export default function ConfirmDelete({ isDeleting, onConfirm, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si no pasaron onConfirm, simplemente no hacemos nada
    if (!onConfirm) return;

    // Ejecuta la función que elimina la card (App.handleCardDelete).
    const maybePromise = onConfirm();

    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise
        .then(() => {
          onClose?.();
        })
        .catch((err) => {
          console.error('Error al eliminar tarjeta:', err);
        });
    } else {
      onClose?.();
    }
  };

  return (
    <form className="confirmationPopup__form" noValidate onSubmit={handleSubmit}>
      <button type="submit" className="confirmationPopup__submit-button" disabled={isDeleting}>
        {isDeleting ? 'Eliminando...' : 'Sí'}
      </button>
    </form>
  );
}
