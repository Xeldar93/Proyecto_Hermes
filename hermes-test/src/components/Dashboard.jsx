// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { obtenerDatosActualizados, obtenerDatosCajas, obtenerDatosFacturas } from './api'; // Importa funciones para obtener datos
import FormDialogAgregarCaja from './FormDialogAgregarCaja'; // Componente para agregar caja
import FormDialogAgregarFactura from './FormDialogAgregarFactura'; // Componente para agregar factura
import backgroundImage from './assets/fondo-hermes.jpg'; // Imagen de fondo
import DonutChart from './DonutChart'; // Componente de gráfico de donut
import ListaCajas from './ListaCajas'; // Componente de lista de cajas
import ListaFacturas from './ListaFacturas'; // componente de lista facturas
import BarChart from './BarChart'; // Componente de gráfico de barras
import { Container, Nav, Navbar, Row, Col } from 'react-bootstrap';

function Dashboard() {
  // Estados
  const [token, setToken] = useState(''); // Token de autenticación
  const [ingresos, setIngresos] = useState([]); // Lista de ingresos
  const [gastos, setGastos] = useState([]); // Lista de gastos
  const [cajas, setCajas] = useState([]); // Lista de cajas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [openCajaDialog, setOpenCajaDialog] = useState(false); // Estado del diálogo de agregar caja
  const [openFacturaDialog, setOpenFacturaDialog] = useState(false); // Estado del diálogo de agregar factura
  const [showMoreCajas, setShowMoreCajas] = useState(false); // Mostrar más cajas
  const [facturas, setFacturas] = useState([]); //Lista de facturas
  const [showMoreFacturas, setShowMoreFacturas] = useState(false); //Mostrar mas facturas

  // Maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/inicio';
  };

   // Obtiene los datos de las cajas
   const fetchCajasData = async () => {
    try {
      const { success, data, message } = await obtenerDatosCajas(token); // Obtiene datos de cajas
      if (success) {
        setCajas(data); // Establece las cajas en el estado
      } else {
        console.error('Error al obtener datos de cajas:', message);
      }
    } catch (error) {
      console.error('Error al obtener datos de cajas:', error.message);
    }
  };

  // Obtiene los datos de las facturas
  const fetchFacturasData = async () => {
    try {
      const { success, data, message } = await obtenerDatosFacturas(token); // Obtiene datos de facturas
      if (success) {
        setFacturas(data); // Establece las facturas en el estado
      } else {
        console.log('datos recibidos', data);
        console.error('Error al obtener datos de facturas:', message);
      }
    } catch (error) {
      console.error('Error al obtener datos de facturas:', error.message);
    }
  };

  // Obtiene los datos actualizados
  const fetchData = async () => {
    try {
      const { success, data, message } = await obtenerDatosActualizados(token); // Obtiene datos actualizados
      if (success) {
        setIngresos(data.ingresos); // Establece ingresos en el estado
        setGastos(data.gastos); // Establece gastos en el estado
        fetchCajasData(); // Obtiene datos de cajas
        fetchFacturasData(); // Obtiene datos de facturas
      } else {
        console.error('Error al obtener datos de ingresos y gastos:', message);
      }
    } catch (error) {
      console.error('Error al obtener datos de ingresos y gastos:', error.message);
    } finally {
      setLoading(false); // Establece carga en falso después de finalizar
    }
  };

  // Muestra el total de ingresos o gastos
  const mostrarTotal = (items) => {
    if (items.length > 0) {
      // Ordenamos los elementos por fecha en orden decreciente
      const sortedItems = [...items].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      // Seleccionamos el primer elemento (el más reciente)
      const mostRecentItem = sortedItems[0];
      return mostRecentItem.total_ingresos || mostRecentItem.total_gastos || 0;
    }
    return 0;
  };
  

  useEffect(() => {
    if (token) {
      fetchCajasData(); // Obtiene datos de cajas al cambiar el token
      fetchData(); // Obtiene datos actualizados al cambiar el token
      fetchFacturasData(); //obtiene datos actualizados al cambiar token
    }
    //eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken); // Obtiene el token almacenado en el almacenamiento local
    }
  }, []);

  // Si está cargando, muestra "Cargando..."
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Renderiza el dashboard
  return (
    <Container fluid style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
      <Navbar bg="dark" expand="lg" variant="dark">
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">

      <Nav className="me-auto ms-2">
        <Nav.Link onClick={() => setOpenCajaDialog(true)} className="btn btn-outline-info text-white">Agregar Caja</Nav.Link>
        <Nav.Link onClick={() => setOpenFacturaDialog(true)} className="btn btn-outline-warning text-white">Agregar Factura</Nav.Link>
      </Nav>

      <Nav className="ml-auto me-2">
        <Nav.Link onClick={handleLogout} className="btn btn-outline-danger text-white">Cerrar sesión</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
      <Row className="align-items-start justify-content-start">

      <Col xs={12} md={6} lg={5} xxl={4}>
          <div className="position-relative">
            <DonutChart ingresos={{ total_ingresos: mostrarTotal(ingresos) }} gastos={{ total_gastos: mostrarTotal(gastos) }} />
          </div>
        </Col>

        <Col xs={12} md={6} lg={7} xxl={7}>
          <BarChart ingresos={ingresos} gastos={gastos} />
        </Col>
        </Row>

        <Row className="ml-auto ms-3">
        <Col xs={12} lg={6} xxl={6}>
          <ListaCajas
            titulo="Cajas"
            items={cajas}
            showMore={showMoreCajas}
            setShowMore={setShowMoreCajas}
            mostrarTotal={mostrarTotal}
          />
        </Col>

        <Col xs={12} lg={6} xxl={6}>
          <ListaFacturas
            titulo="Facturas"
            items={facturas}
            showMore={showMoreFacturas}
            setShowMore={setShowMoreFacturas}
            mostrarTotal={mostrarTotal}
          />
        </Col>

      </Row>
      
      {openCajaDialog && <FormDialogAgregarCaja token={token} onClose={() => setOpenCajaDialog(false)} onDataUpdatedCallback={fetchData} />}
      
      {openFacturaDialog && <FormDialogAgregarFactura token={token} onClose={() => setOpenFacturaDialog(false)} onDataUpdatedCallback={fetchData} />}
    
    </Container>    
    
  );
}

export default Dashboard;
