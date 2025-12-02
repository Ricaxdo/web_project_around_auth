export default function ImagePopup({ card }) {
  if (!card) return null;
  return (
    <div className="imagePopup__container">
      <img className="imagePopup__image" src={card.link} alt={card.name} />
    </div>
  );
}
