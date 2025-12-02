import { useEffect, useState } from 'react';
import '../index.css';

import Footer from './Footer/Footer';
import Header from './Header/Header';
import Main from './Main/Main';

import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/api';

// Helper para simular espera
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  //Estado global del usuario
  const [currentUser, setCurrentUser] = useState(null);

  //Estado global de todas las tarjetas
  const [cards, setCards] = useState([]);

  //Estados de “loading” para los popups
  const [isSavingProfile, setIsSavingProfile] = useState(false); // editar perfil
  const [isSavingAvatar, setIsSavingAvatar] = useState(false); // editar avatar
  const [isAddingCard, setIsAddingCard] = useState(false); // nueva tarjeta
  const [isDeletingCard, setIsDeletingCard] = useState(false); // eliminar tarjeta

  //Cargar datos del usuario una sola vez al montar la app
  useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.error('Error al cargar usuario:', err);
      });
  }, []);

  //Cargar tarjetas iniciales al montar
  useEffect(() => {
    api
      .getInitialCards()
      .then((cardsFromApi) => {
        setCards(cardsFromApi);
      })
      .catch((err) => {
        console.error('Error al cargar tarjetas:', err);
      });
  }, []);

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

    // usamos el flag isLiked que ya sincronizamos con la API
    const isLiked = card.isLiked === true;

    try {
      const updatedCardFromApi = await api.changeCardLike(card._id, !isLiked);

      // combinamos la info vieja de la card con la nueva que viene de la API
      const updatedCard = {
        ...card,
        ...updatedCardFromApi,
        isLiked: !isLiked, // togglamos el valor localmente
      };

      // reemplazamos en el array solo la card que coincide por _id
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

      // quitamos la tarjeta del estado global
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

  return (
    //Proveemos el usuario y funciones relacionadas a través del contexto
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        handleUpdateUser,
        handleUpdateAvatar,
      }}
    >
      <div className="page">
        <Header />
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
      </div>
    </CurrentUserContext.Provider>
  );
}
