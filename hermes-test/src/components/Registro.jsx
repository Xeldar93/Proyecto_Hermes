// registro.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './assets/fondo-hermes.jpg';

function Registro({ onRegister }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleRegistro = async () => {
    console.log('Datos enviados al servidor:', { nombre, email, contraseña });

    if (!nombre || !email || !contraseña) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    } 

    setLoading(true);
    setError('');
    try {
      const result = await onRegister(nombre, email, contraseña);
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
        <h2 className="mb-4">Registrarse</h2>
        <form className="d-flex flex-column align-items-center">
          <input
            type="text"
            placeholder="Nombre del Comercio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control mb-3"
          />
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
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="form-control mb-3"
          />
          <button onClick={handleRegistro} disabled={loading} className="btn btn-primary w-100 mb-3">
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Registro;
