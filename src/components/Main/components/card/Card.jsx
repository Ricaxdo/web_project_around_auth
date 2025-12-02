import heartOutlineIcon from '../../../../images/heart-outline_icon.svg';
import heartIcon from '../../../../images/heart_icon.svg';
import trashIcon from '../../../../images/trash_icon.svg';

export default function Card({ card, onCardLike, onCardDelete, onPreview }) {
  const { _id, name, link, isLiked } = card;

  const handleLikeClick = () => {
    onCardLike?.(card);
  };

  const handleDeleteClick = () => {
    onCardDelete?.(card);
  };

  const handlePreviewClick = () => {
    onPreview?.(card);
  };

  const cardLikeButtonClassName = `photography__info-icon ${
    isLiked ? 'photography__info-icon_active' : ''
  }`;

  return (
    <div className="photography__card">
      <button className="photography__card-button" type="button" onClick={handlePreviewClick}>
        <img className="photography__card-image" src={link} alt={name} />
      </button>

      <img
        className="photography__trash-icon"
        src={trashIcon}
        alt="Eliminar"
        onClick={handleDeleteClick}
      />

      <div className="photography__info">
        <h2 className="photography__info-title">{name}</h2>
        <img
          className={cardLikeButtonClassName}
          src={isLiked ? heartIcon : heartOutlineIcon}
          alt="Me gusta"
          onClick={handleLikeClick}
        />
      </div>
    </div>
  );
}
