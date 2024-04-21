// ListaCajas.jsx
import React from 'react';

function ListaCajas({ titulo, items, showMore, setShowMore }) {
  // Ordenamos los elementos por fecha en orden decreciente
  const sortedItems = [...items].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="ms-md-5 col-md-6 mb-4">
      {/* Título */}
      <h2 className="mb-4 text-white">{titulo} </h2>

      {/* Lista de elementos */}
      <div className="list-group" style={showMore ? { maxHeight: '300px', overflowY: 'scroll' } : {}}>
        {/* Mostrar más elementos si showMore es verdadero */}
        {showMore ? (
          sortedItems.map((item, index) => (
            <button key={index} className="list-group-item list-group-item-action" type="button">
              {/* Detalles de cada elemento */}
              <div>
                <span className="fw-bold">Fecha:</span> {new Date(item.fecha).toLocaleDateString('es-ES')}
              </div>
              <div>
                <span className="fw-bold">Ingreso Efectivo:</span> {item.ingreso_efectivo} €
              </div>
              <div>
                <span className="fw-bold">Ingreso Tarjeta:</span> {item.ingreso_tarjeta} €
              </div>
              <div>
                <span className="fw-bold">Gastos:</span> {item.gastos} €
              </div>
            </button>
          ))
        ) : (
          // Mostrar solo los primeros 3 elementos si showMore es falso
          sortedItems.slice(0, 3).map((item, index) => (
            <button key={index} className="list-group-item list-group-item-action" type="button">
              {/* Detalles de cada elemento */}
              <div>
                <span className="fw-bold">Fecha:</span> {new Date(item.fecha).toLocaleDateString('es-ES')}
              </div>
              <div>
                <span className="fw-bold">Ingreso Efectivo:</span> {item.ingreso_efectivo} €
              </div>
              <div>
                <span className="fw-bold">Ingreso Tarjeta:</span> {item.ingreso_tarjeta} €
              </div>
              <div>
                <span className="fw-bold">Gastos:</span> {item.gastos} €
              </div>
            </button>
          ))
        )}
      </div>

      {/* Botón para mostrar más o menos elementos */}
      {items.length > 3 && (
        <button onClick={() => setShowMore(!showMore)} className="btn btn-outline-warning mt-1">
          {showMore ? 'Mostrar menos' : 'Mostrar más'}
        </button>
      )}
    </div>
  );
}

export default ListaCajas;

