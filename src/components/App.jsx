import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import '../index.css';

import Footer from './Footer/Footer';
import Header from './Header/Header';
import Main from './Main/Main';

import InfoTooltip from './Main/components/InfoTooltip';
import Login from './Main/components/Login';
import ProtectedRoute from './Main/components/ProtectedRoute';
import Register from './Main/components/Register';

import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/api';
import * as auth from '../utils/auth';

// Helper para simular espera
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  // ======= AUTH =======
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isTooltipSuccess, setIsTooltipSuccess] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  const navigate = useNavigate();

  // ======= DATA GLOBAL =======
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);

  // Estados de “loading” para los popups
  const [isSavingProfile, setIsSavingProfile] = useState(false); // editar perfil
  const [isSavingAvatar, setIsSavingAvatar] = useState(false); // editar avatar
  const [isAddingCard, setIsAddingCard] = useState(false); // nueva tarjeta
  const [isDeletingCard, setIsDeletingCard] = useState(false); // eliminar tarjeta

  // ============================
  // 1. Comprobar token al montar
  // ============================
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return;
    api.setToken(token);

    auth
      .checkToken(token) // GET /users/me
      .then((userData) => {
        // userData = { email, _id }
        setIsLoggedIn(true);
        setUserEmail(userData.email);

        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.error('Token inválido:', err);
        localStorage.removeItem('jwt');
        api.setToken(null);
        setIsLoggedIn(false);
      });
  }, [navigate]);

  // ============================
  // 2. Cargar usuario y tarjetas
  //    SOLO si está logueado
  // ============================
  useEffect(() => {
    if (!isLoggedIn) return;

    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.error('Error al cargar usuario:', err);
      });

    api
      .getInitialCards()
      .then((cardsFromApi) => {
        setCards(cardsFromApi);
      })
      .catch((err) => {
        console.error('Error al cargar tarjetas:', err);
      });
  }, [isLoggedIn]);

  // ============================
  // 3. Handlers de AUTH
  // ============================

  const handleRegister = (email, password) => {
    auth
      .register(email, password)
      .then(() => {
        setIsTooltipSuccess(true);
        setTooltipMessage('¡Correcto! Ya estas registrado.');
        setIsTooltipOpen(true);
        navigate('/signin', { replace: true });
      })
      .catch((err) => {
        console.error('Error en registro:', err);
        setIsTooltipSuccess(false);
        setTooltipMessage('Uy, algo salió mal. Por favor, intentalo de nuevo.');
        setIsTooltipOpen(true);
      });
  };

  const handleLogin = (email, password) => {
    auth
      .authorize(email, password)
      .then((data) => {
        localStorage.setItem('jwt', data.token);
        api.setToken(data.token);

        setIsLoggedIn(true);
        setUserEmail(email);

        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.error('Error en login:', err);

        setIsTooltipSuccess(false);

        let message = 'Uy, algo salió mal al iniciar sesión. Inténtalo de nuevo.';

        if (err.status === 401) {
          message = 'Correo o contraseña incorrectos.';
        }

        setTooltipMessage(message);
        setIsTooltipOpen(true);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    api.setToken(null);
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentUser(null);
    setCards([]);
    navigate('/signin', { replace: true });
  };

  const closeTooltip = () => setIsTooltipOpen(false);

  // ============================
  // 4. Handlers de usuario / cards
  // ============================

  //Actualizar nombre / about
  const handleUpdateUser = (data) => {
    setIsSavingProfile(true);

    return api
      .setUserInfo(data)
      .then(async (updatedUser) => {
        await wait(1000);
        setCurrentUser(updatedUser);
      })
      .catch((err) => {
        console.error('Error al actualizar usuario:', err);
        throw err;
      })
      .finally(() => setIsSavingProfile(false));
  };

  //Actualizar avatar del usuario
  const handleUpdateAvatar = ({ avatar }) => {
    setIsSavingAvatar(true);

    return api
      .setUserAvatar({ avatar })
      .then(async (updatedUser) => {
        await wait(1000);
        setCurrentUser(updatedUser);
      })
      .catch((err) => {
        console.error('Error al actualizar avatar:', err);
        throw err;
      })
      .finally(() => setIsSavingAvatar(false));
  };

  //Like / dislike de tarjeta
  const handleCardLike = async (card) => {
    if (!card || !card._id) return;

    const isLiked = card.isLiked === true;

    try {
      const updatedCardFromApi = await api.changeCardLike(card._id, !isLiked);

      const updatedCard = {
        ...card,
        ...updatedCardFromApi,
        isLiked: !isLiked,
      };

      setCards((state) => state.map((c) => (c._id === card._id ? updatedCard : c)));
    } catch (err) {
      console.error('Error al cambiar like:', err);
    }
  };

  // Eliminar tarjeta
  const handleCardDelete = async (card) => {
    if (!card || !card._id) return;

    setIsDeletingCard(true);

    try {
      await wait(1000);
      await api.deleteCard(card._id);

      setCards((state) => state.filter((c) => c._id !== card._id));
    } catch (err) {
      console.error('Error al eliminar tarjeta:', err);
    } finally {
      setIsDeletingCard(false);
    }
  };

  // Crear nueva tarjeta
  const handleAddPlaceSubmit = ({ title, link }) => {
    setIsAddingCard(true);

    return api
      .addNewCard({ title, link })
      .then(async (newCard) => {
        await wait(1000);
        const fixedCard = { ...newCard, likes: newCard.likes ?? [] };
        setCards((prev) => [fixedCard, ...prev]);
      })
      .catch((err) => {
        console.error('Error al agregar tarjeta:', err);
        throw err;
      })
      .finally(() => setIsAddingCard(false));
  };

  // ============================
  // 5. Render
  // ============================

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        handleUpdateUser,
        handleUpdateAvatar,
      }}
    >
      <div className="page">
        {/* Header cambia según si está logueado */}
        <Header isLoggedIn={isLoggedIn} userEmail={userEmail} onSignOut={handleSignOut} />

        <Routes>
          {/* RUTA PRINCIPAL PROTEGIDA */}
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <>
                  <Main
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    onAddPlaceSubmit={handleAddPlaceSubmit}
                    isSavingProfile={isSavingProfile}
                    isSavingAvatar={isSavingAvatar}
                    isAddingCard={isAddingCard}
                    isDeletingCard={isDeletingCard}
                  />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* LOGIN */}
          <Route
            path="/signin"
            element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
          />

          {/* REGISTER */}
          <Route
            path="/signup"
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <Register onRegister={handleRegister} />
            }
          />

          {/* Cualquier otra ruta */}
          <Route
            path="*"
            element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/signin" replace />}
          />
        </Routes>

        <InfoTooltip
          isOpen={isTooltipOpen}
          onClose={closeTooltip}
          isSuccess={isTooltipSuccess}
          message={tooltipMessage}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
