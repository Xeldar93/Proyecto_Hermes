//FormDialogAgregarFactura.jsx
import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest'; // Importa el componente Autosuggest
import { agregarFactura, obtenerProveedores, agregarProveedor } from './api'; // Importa las funciones necesarias del archivo api.jsx
import { jwtDecode } from 'jwt-decode'; // Importa la función jwtDecode para decodificar tokens JWT

function FormDialogAgregarFactura({ onClose, onDataUpdatedCallback }) {
  // Define estados para los datos del formulario y los proveedores
  const [proveedores, setProveedores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [nombreProveedorFactura, setNombreProveedorFactura] = useState('');
  const [nombreProveedorRegistro, setNombreProveedorRegistro] = useState('');
  const [direccionProveedor, setDireccionProveedor] = useState('');
  const [telefonoProveedor, setTelefonoProveedor] = useState('');
  const [emailProveedor, setEmailProveedor] = useState('');
  const [fecha, setFecha] = useState('');
  const [total, setTotal] = useState('');
  const [mostrarAgregarProveedor, setMostrarAgregarProveedor] = useState(false);

  // Se ejecuta al cargar el componente para obtener la lista de proveedores
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const token = localStorage.getItem('token');
        const { success, data, message } = await obtenerProveedores(token);
        if (success) {
          setProveedores(data.proveedores);
        } else {
          console.error('Error al obtener los proveedores:', message);
        }
      } catch (error) {
        console.error('Error al obtener los proveedores:', error.message);
      }
    };

    fetchProveedores();
  }, []);

  // Función para obtener sugerencias de proveedores según el valor ingresado en el campo de búsqueda
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  // Funciones para manejar la presentación de las sugerencias
  const getSuggestionValue = (suggestion) => suggestion.nombre;
  const renderSuggestion = (suggestion) => (
    <div style={{ color: 'white' }}>
      {suggestion.nombre}
    </div>
  );

  // Funciones para manejar el cambio en el campo de búsqueda de proveedores
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  const handleChangeNombreProveedorFactura = (event, { newValue }) => {
    setNombreProveedorFactura(newValue);
  };

  // Función para manejar el envío del formulario de factura
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let proveedorId;
      const proveedorExistente = proveedores.find(proveedor => proveedor.nombre.toLowerCase() === nombreProveedorFactura.toLowerCase());
      
      if (proveedorExistente) {
        proveedorId = proveedorExistente.id_proveedor;
      } else {
        console.error('No se encontró un proveedor con el nombre especificado. Agregue el proveedor primero.');
        return;
      }
  
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token); 
      const id_usuario = decodedToken.id_usuario; 

      const facturaResponse = await agregarFactura(token, proveedorId, id_usuario, fecha, total);
      console.log(facturaResponse);
      onClose();
      if (facturaResponse.success) {
        // Llama a la función de devolución de llamada para actualizar los datos en el Dashboard
        onDataUpdatedCallback();
        console.log('Datos actualizados:', facturaResponse.data); // Imprime los datos actualizados en la consola
      } 
    } catch (error) {
      console.error('Error al agregar factura:', error.message);
    }
  };  

  // Función para manejar el envío del formulario de agregar proveedor
  const handleAgregarProveedor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await agregarProveedor(token, nombreProveedorRegistro, direccionProveedor, telefonoProveedor, emailProveedor);
      if (response.success) {
        console.log('Proveedor agregado correctamente:', response.data);
        // Actualizar la lista de proveedores en el estado
        setProveedores(prevProveedores => [...prevProveedores, response.data]);
        // Actualizar las sugerencias incluyendo el nuevo proveedor
        setSuggestions(prevSuggestions => [...prevSuggestions, response.data]);
        // Restablecer los campos del formulario
        setNombreProveedorRegistro('');
        setDireccionProveedor('');
        setTelefonoProveedor('');
        setEmailProveedor('');
      } else {
        console.error('Error al agregar proveedor:', response.message);
      }
      
    } catch (error) {
      console.error('Error al agregar proveedor:', error.message);
    }
  };

  // Renderiza el formulario de agregar factura
  return (
    <div style={{ position: 'fixed', top: '50px', left: '80px', right: '80px', bottom: '50px', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '999' }}>
      <div className="modal-dialog" style={{ maxWidth: '400px' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" style={{ color: 'white' }}>Agregar Factura</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Campo de búsqueda de proveedores con sugerencias */}
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                  placeholder: 'Nombre del Proveedor',
                  value: nombreProveedorFactura,
                  onChange: handleChangeNombreProveedorFactura,
                  style: { color: 'auto' }
                }}
              />
              <br />
              {/* Campo de fecha */}
              <label style={{ color: 'white' }}>
                Fecha:
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="form-control"
                />
              </label>
              <br />
              {/* Campo de total */}
              <label style={{ color: 'white' }}>
                Total:
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  className="form-control"
                />
              </label>
              <br />
              {/* Botones para confirmar o cerrar el formulario */}
              <button type="submit" className="btn btn-primary mt-1 me-2">Confirmar</button>
              <button onClick={() => onClose()} className="btn btn-secondary mt-1">Cerrar</button>
            </form>

            {/* Botón para mostrar formulario de agregar proveedor */}
            <button onClick={() => setMostrarAgregarProveedor(true)} className="btn btn-primary mt-3">Agregar Proveedor</button>
            {mostrarAgregarProveedor && (
              <div>
                <h4 style={{ color: 'white' }}>Agregar Proveedor</h4>
                <form onSubmit={handleAgregarProveedor}>
                  {/* Campos para ingresar datos del nuevo proveedor */}
                  <label style={{ color: 'white' }}>
                    Nombre:
                    <input
                      type="text"
                      value={nombreProveedorRegistro}
                      onChange={(e) => setNombreProveedorRegistro(e.target.value)}
                      className="form-control"
                    />
                  </label>
                  <br />
                  <label style={{ color: 'white' }}>
                    Dirección:
                    <input
                      type="text"
                      value={direccionProveedor}
                      onChange={(e) => setDireccionProveedor(e.target.value)}
                      className="form-control"
                    />
                  </label>
                  <br />
                  <label style={{ color: 'white' }}>
                    Teléfono:
                    <input
                      type="text"
                      value={telefonoProveedor}
                      onChange={(e) => setTelefonoProveedor(e.target.value)}
                      className="form-control"
                    />
                  </label>
                  <br />
                  <label style={{ color: 'white' }}>
                    Email:
                    <input
                      type="email"
                      value={emailProveedor}
                      onChange={(e) => setEmailProveedor(e.target.value)}
                      className="form-control"
                    />
                  </label>
                  <br />
                  {/* Botones para guardar o cerrar el formulario de agregar proveedor */}
                  <button type="submit" className="btn btn-primary mt-1 me-2">Guardar</button>
                  <button onClick={() => setMostrarAgregarProveedor(false)} className="btn btn-secondary mt-1">Cerrar</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormDialogAgregarFactura;
