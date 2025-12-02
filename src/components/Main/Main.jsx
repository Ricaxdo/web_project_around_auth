import { useContext, useState } from 'react';
import editIcon from '../../images/edit-button_icon.png';
import plusIcon from '../../images/icon-plus_icon.png';
import userImage from '../../images/usuario.png';

// Componentes del sistema
import Card from '../Main/components/card/Card';
import ConfirmDelete from '../Main/components/form/confirmdelete/ConfirmDelete';
import EditProfile from '../Main/components/form/editprofile/EditProfile';
import ImagePopup from '../Main/components/form/imagepopup/ImagePopup';
import NewCard from '../Main/components/form/newcard/NewCard';
import Popup from '../Main/components/popup/Popup';
import EditAvatar from './components/form/editavatar/EditAvatar';

// Contexto de usuario
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

export default function Main({
  cards,
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
  isSavingProfile,
  isSavingAvatar,
  isAddingCard,
  isDeletingCard,
}) {
  const [popup, setPopup] = useState({ type: null, card: null });

  const { currentUser } = useContext(CurrentUserContext) ?? {};

  const profile = currentUser || {
    name: 'Ricardo Castro',
    about: 'Front-end Developer',
    avatar: userImage,
  };

  const handleClosePopup = () => setPopup({ type: null, card: null });

  //----------------------------
  // Helpers para abrir cada popup
  //----------------------------

  const openNewCardPopup = () => setPopup({ type: 'newCard', card: null });

  const openEditProfilePopup = () => setPopup({ type: 'editProfile', card: null });

  const openAvatarPopup = () => setPopup({ type: 'avatar', card: null });

  const openConfirmDeletePopup = (card) => setPopup({ type: 'confirmDelete', card });

  const openImagePopup = (card) => setPopup({ type: 'image', card });

  //-------------------------------------------
  // Configuración de títulos y variantes CSS
  //-------------------------------------------
  const getPopupConfig = () => {
    switch (popup.type) {
      case 'newCard':
        return { title: 'Nuevo lugar', variant: 'addPopup' };

      case 'editProfile':
        return { title: 'Editar perfil', variant: 'editPopup' };

      case 'avatar':
        return {
          title: 'Actualizar foto de perfil',
          variant: 'avatarPopup',
        };

      case 'confirmDelete':
        return {
          title: '¿Eliminar card?',
          variant: 'confirmationPopup',
        };

      case 'image':
        return { title: null, variant: 'imagePopup' };

      default:
        return { title: null, variant: '' };
    }
  };

  const popupConfig = getPopupConfig();

  return (
    <div className="content">
      {/* ------------------------------------------------ */}
      {/* -------------- Profile Section ----------------- */}
      {/* ------------------------------------------------ */}
      <section className="profile">
        <div className="profile__avatar">
          <img
            className="profile__avatar-image"
            src={profile.avatar || userImage}
            alt="Imagen de perfil"
          />

          {/** Botón para abrir popup de cambiar avatar */}
          <button
            className="profile__avatar-edit"
            aria-label="Cambiar avatar"
            type="button"
            onClick={openAvatarPopup}
          >
            <img src={editIcon} alt="icono de editar" className="profile__avatar-edit-icon" />
          </button>
        </div>

        <div className="profile__info">
          <h1 className="profile__info-name">{profile.name}</h1>

          {/** Botón para abrir popup de editar perfil */}
          <button className="profile__edit-icon" type="button" onClick={openEditProfilePopup}>
            <img className="profile__edit-icon-image" src={editIcon} alt="Icono de editar" />
          </button>

          <p className="profile__info-description">{profile.about}</p>
        </div>

        {/** Botón para abrir popup de añadir nueva tarjeta */}
        <button className="profile__add-button-rectangle" type="button" onClick={openNewCardPopup}>
          <img className="profile__add-button-icon" src={plusIcon} alt="Icono de añadir" />
        </button>
      </section>

      {/* ------------------------------------------------ */}
      {/* -------------- Photography Section ------------- */}
      {/* ------------------------------------------------ */}
      <section className="photography">
        <h2 className="photography__heading" hidden>
          Galería de fotos
        </h2>

        {/** Render de todas las cards mostrando like, delete, preview */}
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardLike={onCardLike}
            onCardDelete={(cardToDelete) => openConfirmDeletePopup(cardToDelete)}
            onPreview={(cardToPreview) => openImagePopup(cardToPreview)}
          />
        ))}
      </section>

      {/* ------------------------------------------------ */}
      {/* -------------- Popup condicional ---------------- */}
      {/* ------------------------------------------------ */}
      {popup.type && (
        <Popup onClose={handleClosePopup} title={popupConfig.title} variant={popupConfig.variant}>
          {/** Popup para crear nueva tarjeta */}
          {popup.type === 'newCard' && (
            <NewCard
              isSaving={isAddingCard} // muestra "Creando…"
              onAddNewCard={onAddPlaceSubmit}
              onClose={handleClosePopup}
            />
          )}

          {/** Popup editar perfil */}
          {popup.type === 'editProfile' && (
            <EditProfile isSaving={isSavingProfile} onClose={handleClosePopup} />
          )}

          {/** Popup actualizar avatar */}
          {popup.type === 'avatar' && (
            <EditAvatar isSaving={isSavingAvatar} onClose={handleClosePopup} />
          )}

          {/** Popup confirmar eliminación */}
          {popup.type === 'confirmDelete' && (
            <ConfirmDelete
              isDeleting={isDeletingCard} // muestra "Eliminando…"
              onConfirm={() => onCardDelete?.(popup.card)} // eliminación real
              onClose={handleClosePopup} // cerrar después
            />
          )}

          {/** Popup para mostrar imagen grande */}
          {popup.type === 'image' && <ImagePopup card={popup.card} />}
        </Popup>
      )}
    </div>
  );
}
