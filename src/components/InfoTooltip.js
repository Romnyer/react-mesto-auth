import React, {useRef} from "react";
import success from '../images/Success.svg';
import failed from '../images/Failed.svg';

function InfoTooltip ({isSuccess, isOpen, onClose, handleCloseByClick}) {
  const popup = useRef();

  function handleClose(evt) {
    handleCloseByClick(evt, popup);
  };

  function handleButtonClose() {
    onClose()
  };

  return (
    <div
      className={`popup ${isOpen ? 'popup_opened' : ''}`}
      onClick={handleClose}
      ref={popup}
    >
      <div className="popup__container">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Кнопка закрытия формы"
          onClick={handleButtonClose}
        />
        <div className="tooltip popup__form">
          <img className="tooltip__pic" src={isSuccess ? success : failed} alt={isSuccess ? "Успех!" : "Что-то пошло не так!"}/>
          <p className="tooltip__text">
            {isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default InfoTooltip;
