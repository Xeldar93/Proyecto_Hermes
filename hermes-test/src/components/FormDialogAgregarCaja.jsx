//FormDialogAgregarCaja.jsx
import React, { useState } from 'react';
import { agregarDatosCaja } from './api'; // Importa las funciones necesarias del archivo api.jsx

function FormDialogAgregarCaja({ token, onClose, onDataUpdatedCallback }) {
  // Define estados para los datos del formulario
  const [ingresoEfectivo, setIngresoEfectivo] = useState('');
  const [ingresoTarjeta, setIngresoTarjeta] = useState('');
  const [gastos, setGastos] = useState('');
  const [fecha, setFecha] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    try {
      // Realiza una solicitud para agregar datos a la caja
      const response = await agregarDatosCaja(token, fecha, ingresoEfectivo, ingresoTarjeta, gastos);
      console.log(response); // Imprime la respuesta en la consola
      onClose(); // Cierra el diálogo modal después de enviar el formulario
      if (response.success) {
        // Llama a la función de devolución de llamada para actualizar los datos en el Dashboard
        onDataUpdatedCallback();
        console.log('Datos actualizados:', response.data); // Imprime los datos actualizados en la consola
      } 
      
    } catch (error) {
      console.error('Error al agregar datos a la caja:', error.message); // Imprime un mensaje de error si falla la solicitud para agregar datos a la caja
    }
  };

  // Renderiza el formulario de agregar datos a la caja
  return (
    <div style={{ position: 'fixed', top: '50px', left: '80px', right: '80px', bottom: '50px', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '999' }}>
      <div className="modal-dialog" style={{ maxWidth: '400px' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ color: 'white' }}>Agregar Datos a la Caja</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Campos del formulario para ingresar los datos */}
              <div className="mb-3">
                <label htmlFor="ingresoEfectivo" className="form-label" style={{ color: 'white' }}>Ingreso en Efectivo:</label>
                <input type="number" className="form-control" id="ingresoEfectivo" value={ingresoEfectivo} onChange={(e) => setIngresoEfectivo(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="ingresoTarjeta" className="form-label" style={{ color: 'white' }}>Ingreso en Tarjeta:</label>
                <input type="number" className="form-control" id="ingresoTarjeta" value={ingresoTarjeta} onChange={(e) => setIngresoTarjeta(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="gastos" className="form-label" style={{ color: 'white' }}>Gastos:</label>
                <input type="number" className="form-control" id="gastos" value={gastos} onChange={(e) => setGastos(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="fecha" className="form-label" style={{ color: 'white' }}>Fecha:</label>
                <input type="date" className="form-control" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>
              {/* Botones para confirmar o cerrar el formulario */}
              <button type="submit" className="btn btn-primary me-1">Confirmar</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormDialogAgregarCaja;
