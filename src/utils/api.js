class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl.replace(/\/+$/, '');
    this._headers = {}; // headers base
    this._token = null; // aquí guardamos el JWT
  }

  // Permite configurar el token dinámicamente desde App.jsx
  setToken(token) {
    this._token = token;
  }

  // Headers base (Authorization + lo que quieras agregar globalmente)
  _getBaseHeaders() {
    const headers = { ...this._headers };

    if (this._token) {
      headers.Authorization = `Bearer ${this._token}`;
    }

    return headers;
  }

  //Checar respuesta de la API generica
  _checkResponse(res) {
    if (res.ok) return res.json();
    return res.text().then((text) => {
      const err = new Error(`Error ${res.status}: ${text || 'Error en la respuesta de la API'}`);
      err.status = res.status;
      err.statusText = res.statusText;
      err.url = res.url;
      err.body = text;
      throw err;
    });
  }

  // Realizar una solicitud genérica
  _request(path, options = {}) {
    const url = `${this._baseUrl}${path}`;

    const headers = {
      ...this._getBaseHeaders(), // Authorization: Bearer <token> si existe
      ...(options.headers || {}), // headers específicos del método
    };

    return fetch(url, { ...options, headers }).then((res) => this._checkResponse(res));
  }

  // Cargar informacion del usuario
  getUserInfo() {
    return this._request('/users/me');
  }

  // Cargar tarjetas iniciales
  getInitialCards() {
    return this._request('/cards');
  }

  // Cargar ambos datos iniciales simultaneamente
  getInitialData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  // Actualizar informacion del usuario
  setUserInfo({ name, about }) {
    return this._request('/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, about }),
    });
  }

  // Añadir nueva tarjeta
  addNewCard({ title, link }) {
    return this._request('/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: title, link }),
    });
  }

  // Añadir/Quitar like
  changeCardLike(cardId, isLike) {
    return this._request(`/cards/${cardId}/likes`, {
      method: isLike ? 'PUT' : 'DELETE',
    });
  }

  //Eliminar tarjeta
  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, { method: 'DELETE' });
  }

  //Actualizar avatar
  setUserAvatar({ avatar }) {
    return this._request('/users/me/avatar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatar }),
    });
  }
}

// OJO: deja la baseUrl como la que usabas para “Alrededor de los EE.UU.”
export const api = new Api({
  baseUrl: 'https://around-api.es.tripleten-services.com/v1',
});
