import {useState, useEffect} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';

import Header from './Header.js';
import Main from './Main.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import DeleteCardPopup from './DeleteCardPopup.js';
import ImagePopup from './ImagePopup.js';
import Footer from './Footer.js';
import PageNotFound from './PageNotFound.js';
import ProtectedRoute from './ProtectedRoute.js';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';

import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import api from '../utils/api.js';
import auth from '../utils/auth.js';

const esc = 'Escape';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false),
        [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false),
        [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false),
        [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false),
        [isImagePopupOpen, setIsImagePopupOpen] = useState(false),
        [selectedCard, setSelectedCard] = useState({}),
        [currentUser, setCurrentUser] = useState({}),
        [email, setEmail] = useState(''),
        [cards, setCards] = useState([]),
        [isTooltipOpen, setTooltipOpen] = useState(false),
        [loggedIn, setLoggedIn] = useState(false),
        [isSuccess, setIsSuccess] = useState(false);

  const allPopupSeters = [setIsEditProfilePopupOpen,
        setIsAddPlacePopupOpen,
        setIsEditAvatarPopupOpen,
        setIsDeletePopupOpen,
        setIsImagePopupOpen,
        setTooltipOpen],
        allPopupIsOpen = [isEditProfilePopupOpen,
          isAddPlacePopupOpen,
          isEditAvatarPopupOpen,
          isDeletePopupOpen,
          isImagePopupOpen,
          isTooltipOpen];

  const isAnyPopupOpen = allPopupIsOpen.some(popup => {
    return popup === true;
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


  /* Set user info and cards array from fetch */


  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      Promise.all([api.getProfileInfo(), api.getCards(), auth.getUserInfo(localStorage.getItem('jwtToken'))])
        .then(([userData, cardList, authData]) => {
          setCurrentUser(userData);
          setCards(cardList);
          setEmail(authData.data.email);

          setLoggedIn(true);
          navigate('/', {replace: true});
        })
        .catch(err => console.log(err));
    }
  }, []);


  /* Handlers */


  //Hadlers for popup open buttons
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };
  function handleDeleteClick(card) {
    setSelectedCard(card);
    setIsDeletePopupOpen(true);
  };
  function handleCloseByClick(evt, ref) {
    if (evt.target === ref.current) {
      closeAllPopups();
    }
  };


  //Handle click on card pic
  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  };

  //Handle card like
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err))
  };


  /* Submits */


  //Timeout for visual effect
  //Without timeout user will see effect of setIsLoading() before popup closed
  function timeoutClosing() {
    setTimeout(() => {
      setIsLoading(false);
    }, 500)
  };

  //Submit profile
  function handleUpdateUser(name, description) {
    setIsLoading(true);
    api.changeUserInfo(name, description)
      .then(userData => {
        setCurrentUser({
          ...currentUser,
          name: userData.name,
          about: userData.about
        });
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => timeoutClosing())
  };

  //Submit avatar
  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.changeAvatar(avatar)
      .then(userData => {
        setCurrentUser({
          ...currentUser,
          avatar: userData.avatar
        });
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => timeoutClosing())
  };

  //Sumbit place
  function handleAddPlace(place, link) {
    setIsLoading(true);
    api.addCard(place, link)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => timeoutClosing())
  };

  //Submit delete card
  function handleCardDelete(card) {
    setIsLoading(true);
    api.deleteCard(card._id)
      .then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
      closeAllPopups();
    })
      .catch(err => console.log(err))
      .finally(() => timeoutClosing())

  };

  //Sign in and set jwt
  function handleLoginSubmit(email, password) {
    setIsLoading(true);
    auth.signin(email, password)
      .then(data => {
        localStorage.setItem('jwtToken', data.token);
        setLoggedIn(true);
        navigate('/', {replace: true});
      })
      .catch(err => {
        console.log(err);
        setTooltipOpen(true);
        setIsSuccess(false);
      })
      .finally(() => timeoutClosing())
  };

  //Sign up
  function handleRegisterSubmit(email, password) {
    setIsLoading(true);
    auth.signup(email, password)
      .then(data => {
        console.log(data);
        setTooltipOpen(true);
        setIsSuccess(true);
        navigate('/', {replace: true});
      })
      .catch(err => {
        console.log(err);
        setTooltipOpen(true);
        setIsSuccess(false);
      })
      .finally(() => timeoutClosing())
  };


  /* Popups close */


  function closeAllPopups() {
    allPopupSeters.forEach(seter => {
      seter(false);
    })
  };

  //Close popups by Esc
  useEffect(() => {
    function closePopupByEsc(evt) {
      if (evt.key === esc) {
        closeAllPopups();
      }
    };

    if (isAnyPopupOpen) {
      document.addEventListener('keydown', closePopupByEsc);
    }

    return () => {
      document.removeEventListener('keydown', closePopupByEsc);
    }
  }, [...allPopupIsOpen]);



  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          email={email}
        />
        <Routes>
          <Route path="/" element={
            <ProtectedRoute loggedIn={loggedIn} element={
              <Main
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                handleCardLike={handleCardLike}
                handleDeleteClick={handleDeleteClick}
              />
              }
            />
            }
          />

          {/*Sign in*/}

          <Route path="sign-in" element={<Login
            title={'Вход'}
            onSubmit={handleLoginSubmit}
            valueText={'Войти'}
            valueLoadingText={'Вход...'}
            isLoading={isLoading}
          />}
          />

          {/*Sign up*/}

          <Route path="sign-up" element={<Register
            onSubmit={handleRegisterSubmit}
            isLoading={isLoading}
          />}
          />

          {/*Page 404*/}

          <Route path="*" element={<PageNotFound/>}/>

        </Routes>

        <Footer/>

        {/*Profile popup*/}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
          handleCloseByClick={handleCloseByClick}
        />

        {/*Avatar popup*/}

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
          handleCloseByClick={handleCloseByClick}
        />

        {/*Add place popup*/}

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
          isLoading={isLoading}
          handleCloseByClick={handleCloseByClick}
        />

        {/*Delete place popup*/}

        <DeleteCardPopup
          card={selectedCard}
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
          isLoading={isLoading}
          handleCloseByClick={handleCloseByClick}
        />

        {/*Place popup*/}

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          handleCloseByClick={handleCloseByClick}
        />

        {/*Success tooltip*/}

        <InfoTooltip
          isOpen={isTooltipOpen}
          isSuccess={isSuccess}
          onClose={closeAllPopups}
          handleCloseByClick={handleCloseByClick}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
