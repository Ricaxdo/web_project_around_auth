import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    // si NO está logueado, siempre lo mandamos a /signin
    return <Navigate to="/signin" replace />;
  }

  // si está logueado, mostramos el contenido protegido
  return children;
}
