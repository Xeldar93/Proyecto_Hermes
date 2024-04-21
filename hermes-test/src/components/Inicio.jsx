//Inicio.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import hermesLogo from './assets/hermesLogo.jpg';
import backgroundImage from './assets/fondo-hermes.jpg';

const Inicio = () => {
  return (
    <div
      className="container-fluid text-center vh-100"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="text-white">
        <h1 className="font-italic mb-4" style={{ fontFamily: 'serif', fontSize: '4rem', textShadow: '0 0 10px gold' }}>Hermes</h1>
        <img className="rounded-circle mb-4" src={hermesLogo} alt='logo' width="150" height="150" />
        <p className="font-italic mb-5" style={{ fontFamily: 'serif', fontSize: '1.5rem', textShadow: '0 0 10px gold' }}>Gestión de Comercios</p>
        <div className="d-flex justify-content-center">
          <button type='button' className="btn btn-primary mx-2"><Link to="/login" className="text-white">ENTRAR</Link></button>
          <button type='button' className="btn btn-secondary mx-2"><Link to="/registro" className="text-white">REGISTRARSE</Link></button>
        </div>
      </div>
    </div>
  );
}

export default Inicio;

