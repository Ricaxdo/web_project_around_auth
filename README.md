# around-react-auth

Proyecto Sprint 18 - Frontend de la aplicación **“Alrededor de los EE.UU.”** desarrollado con **React + Vite**, implementando **registro, inicio de sesión y rutas protegidas** con JWT.

Este proyecto consume dos APIs de TripleTen:
- **Auth API** (registro/login/validación del token)
- **Around API** (usuarios y tarjetas), protegida por `Authorization: Bearer <token>`

---

## Descripción

La aplicación permite a los usuarios:
- Registrarse e iniciar sesión usando JWT.
- Mantener la sesión activa entre recargas gracias a `localStorage`.
- Acceder a la funcionalidad principal (tarjetas y perfil) únicamente si están autorizados.
- Ver mensajes de éxito/error mediante un modal informativo (InfoTooltip).

La ruta principal `/` está protegida: si un usuario no autorizado intenta entrar a cualquier ruta, será redirigido automáticamente a `/signin`.

---

## Flujo paso a paso (cómo funciona)

1. **Registro**
   - El usuario se registra en `/signup`.
   - Se envía `email` y `password` a `POST /signup`.
   - Si el registro es exitoso, se muestra un `InfoTooltip` y se redirige a `/signin`.

2. **Inicio de sesión**
   - El usuario inicia sesión en `/signin`.
   - Se envía `email` y `password` a `POST /signin`.
   - Si es correcto, el backend devuelve un `token`.

3. **Persistencia de sesión**
   - El token se guarda en `localStorage` (`jwt`).
   - Al recargar o volver a entrar, la app:
     - lee el token desde `localStorage`
     - valida el token con `GET /users/me`
     - si es válido, restaura la sesión y redirige a `/`

4. **Acceso a la app principal**
   - Todas las solicitudes a la Around API se hacen con:
     - `Authorization: Bearer <token>`
   - Permite cargar usuario y tarjetas, crear/eliminar cards y dar/quitar likes.

5. **Cerrar sesión**
   - El token se elimina de `localStorage`.
   - Se limpia el estado global y se redirige a `/signin`.

---

## Tecnologías usadas

**Frontend**
- React
- Vite
- JavaScript (JSX)
- React Router DOM
- Fetch API

**Auth**
- JWT (almacenado en `localStorage`)
- Rutas protegidas (ProtectedRoute)

---

##  Características principales

- **Registro y login** con JWT
- **Validación de token** con `GET /users/me`
- **Persistencia de sesión** con `localStorage`
- **Protección de rutas** (`/` solo para usuarios autorizados)
- **Redirecciones automáticas**
  - si no estás logueado → te manda a `/signin`
  - si ya estás logueado → te manda a `/`
- **InfoTooltip** (modal) para feedback de éxito/error
- **Header dinámico**
  - público: “Inicia sesión / Regístrate”
  - logueado: muestra email y cerrar sesión (con menú responsive en pantallas pequeñas)

---

##  APIs utilizadas

### Auth API (TripleTen)
Base URL:
- `https://se-register-api.en.tripleten-services.com/v1`

Endpoints:
- `POST /signup` → registro
- `POST /signin` → login
- `GET /users/me` → validación de token (requiere `Bearer token`)

### Around API (TripleTen)
Base URL:
- `https://around-api.es.tripleten-services.com/v1`

Endpoints utilizados (requieren token):
- `GET /users/me`
- `GET /cards`
- `PATCH /users/me`
- `PATCH /users/me/avatar`
- `POST /cards`
- `DELETE /cards/:id`
- `PUT /cards/:id/likes`
- `DELETE /cards/:id/likes`
