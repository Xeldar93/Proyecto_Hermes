//login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './assets/fondo-hermes.jpg';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    // Validación de los campos
    if (!email || !password) {
      setError('Por favor, introduce unas credenciales correctamente.');
      setLoading(false);
      return;
    }

    try {
      const result = await onLogin(email, password);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard'); // Redirige al usuario al dashboard
      } else {
        setError(result.message);
      }
    } catch (err) {
      setLoading(false);
      setError('Ha ocurrido un error en el servidor.');
    }
  };

  return (
    <div
      className="container-fluid text-center vh-100 d-flex align-items-center justify-content-center"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-white">
        <h2 className="mb-4">Iniciar Sesión</h2>
        <form className="d-flex flex-column align-items-center">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-3"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-3"
          />
          <button onClick={handleLogin} disabled={loading} className="btn btn-primary w-100 mb-3">
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
