import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { loginUser, registerUser, obtenerDatosCajas, obtenerDatosActualizados } from './components/api';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import Inicio from './components/Inicio';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token')); // Obtener el token del almacenamiento local
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (token) {
        // Invoca cada función por separado y espera su respuesta
        const responseActualizados = await obtenerDatosActualizados(token);
        const responseCajas = await obtenerDatosCajas(token);
  
        // Verifica si hay errores en alguna de las respuestas
        if (!responseActualizados.success) {
          setError(responseActualizados.message); // Establecer el error en el estado
        } else if (!responseCajas.success) {
          setError(responseCajas.message); // Establecer el error en el estado
        }
      }
    };
  
    checkTokenValidity();
  }, [token]);
  

  const handleLogin = async (email, contraseña) => {
    const { success, data, error } = await loginUser({ email, contraseña });
    if (success) {
      setToken(data.token);
      localStorage.setItem('token', data.token); // Guardar el token en el almacenamiento local
    } else {
      setError(error); // Establecer el error en el estado
    }
    return { success, data };
  };

  const handleRegister = async (nombre, email, contraseña) => {
    return await registerUser({ nombre, email, contraseña });
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/registro" element={<Registro onRegister={handleRegister} />} />
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard token={token} />
            ) : (
              <Navigate to={error ? '/login' : '/inicio'} replace /> // Redirigir al usuario al inicio de sesión si hay un error
            )
          }
        />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/" element={<Navigate to="/inicio" />} />
      </Routes>
    </Router>
  );
}

export default App;

