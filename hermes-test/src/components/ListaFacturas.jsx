// ListaFacturas.jsx
import React, {useState, useEffect} from 'react';
import { obtenerProveedores } from './api';

function ListaFacturas({ titulo, items, showMore, setShowMore }) {
  // Ordenamos los elementos por fecha en orden decreciente
  const sortedItems = [...items].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  const [proveedores, setProveedores] = useState({});

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
    const token = localStorage.getItem('token');
      const { success, data, message } = await obtenerProveedores(token);
      if (success) {
         // Construir el objeto de proveedores con IDs como claves y nombres como valores
        const proveedoresObj = {};
        data.proveedores.forEach(proveedor => {
          proveedoresObj[proveedor.id_proveedor] = proveedor.nombre;
        });
        setProveedores(proveedoresObj);
      } else {
        console.error('Error al obtener los proveedores', message);
      }
    } catch (error) {
      console.error('Error al obtener los proveedores', error.message);
      }
    };

    fetchProveedores();
  }, []);

  return (
    <div className="ms-md-4 col-md-6 mb-4">
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
                <span className="fw-bold">Proveedor:</span> {proveedores[item.id_proveedor]}
              </div>
              <div>
                <span className="fw-bold">Total Factura:</span> {item.total} €
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
                <span className="fw-bold">Proveedor:</span> {proveedores[item.id_proveedor]}
              </div>
              <div>
                <span className="fw-bold">Total Factura:</span> {item.total} €
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

export default ListaFacturas;

