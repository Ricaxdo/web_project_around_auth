const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

/**
 * Manejo centralizado de respuestas de fetch
 * - Intenta parsear el body como JSON
 * - Si la respuesta NO es exitosa, crea un error
 */
function handleResponse(res) {
  return res
    .json()
    .catch(() => ({}))
    .then((body) => {
      if (res.ok) {
        return body;
      }

      // Error → construimos un error
      const error = new Error(body.message || `Error ${res.status}`);
      error.status = res.status;
      error.body = body;
      throw error;
    });
}

/**
 * ===============================
 * REGISTRO DE USUARIO
 * POST /signup
 * Body esperado: { email, password }
 *
 * Respuesta exitosa:
 * { data: { email, _id } }
 *
 * ===============================
 */
export function register(email, password) {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then(handleResponse)
    .then((data) => data.data);
}

/**
 * ===============================
 * LOGIN / AUTORIZACIÓN
 * POST /signin
 * Body esperado: { email, password }
 *
 * Respuesta exitosa:
 * { token: "JWT..." }
 *
 * ===============================
 */
export function authorize(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

/**
 * ===============================
 * VALIDACIÓN DEL TOKEN
 * GET /users/me
 * Encabezado:
 * Authorization: Bearer <token>
 *
 * Respuesta exitosa:
 * { data: { email, _id } }
 *
 * ===============================
 */
export function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(handleResponse)
    .then((data) => data.data);
}
