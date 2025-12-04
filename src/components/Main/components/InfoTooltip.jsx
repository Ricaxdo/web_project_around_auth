import badIcon from '../../../images/bad.png';
import goodIcon from '../../../images/good.png';
import Popup from '../components/popup/Popup.jsx';

function InfoTooltip({ isOpen, onClose, isSuccess, message }) {
  if (!isOpen) return null;

  return (
    <Popup onClose={onClose} variant="infoPopup" title="">
      <div className="infoPopup__content">
        <img
          src={isSuccess ? goodIcon : badIcon}
          alt={isSuccess ? 'Éxito' : 'Error'}
          className="infoPopup__icon"
        />
        <p className="infoPopup__info-text">{message}</p>
      </div>
    </Popup>
  );
}

export default InfoTooltip;
