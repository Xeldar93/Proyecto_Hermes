// api.jsx
// Importa las funciones necesarias de la librería 'fetch' para realizar peticiones HTTP
export async function loginUser(credentials) {
  try {
    // Imprime en la consola los datos enviados al servidor para iniciar sesión
    console.log('Datos enviados al servidor para iniciar sesión:', credentials);
    // Realiza una solicitud POST al endpoint '/login' del servidor
    const response = await fetch('https://xeldar93.alwaysdata.net/login', {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    // Convierte la respuesta en formato JSON
    const data = await response.json();

    // Almacena el token de autenticación en el almacenamiento local (localStorage)
    localStorage.setItem('token', data.token);

    // Si la respuesta no es exitosa, lanza un error con el mensaje proporcionado por el servidor o un mensaje por defecto
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    // Si la respuesta es exitosa, devuelve un objeto con success: true y los datos de la respuesta
    return { success: true, data };
  } catch (error) {
    // Si ocurre un error en la petición, devuelve un objeto con success: false y el mensaje de error
    return { success: false, message: error.message };
  }
}

// Función para registrar un nuevo usuario
export async function registerUser(userData) {
  // Verifica si se proporcionaron todos los datos necesarios
  if (!userData.nombre || !userData.email || !userData.contraseña) {
    return { success: false, message: 'error datos'  };
  }

  try {
    // Imprime en la consola los datos enviados al servidor para registrar usuario
    console.log('Datos enviados al servidor para registrar usuario:', userData);
    // Realiza una solicitud POST al endpoint '/registro' del servidor
    const response = await fetch('https://xeldar93.alwaysdata.net/registro', {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    // Convierte la respuesta en formato JSON
    const data = await response.json();
    // Si la respuesta no es exitosa, lanza un error con el mensaje proporcionado por el servidor
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrarse');
    }
    // Si la respuesta es exitosa, devuelve un objeto con success: true y los datos de la respuesta
    return { success: true, data };
  } catch (error) {
    // Si ocurre un error en la petición, devuelve un objeto con success: false y el mensaje de error
    return { success: false, message: error.message };
  }
}

// Función para obtener los datos actualizados de ingresos y gastos
export async function obtenerDatosActualizados(token) {
  try {
    // Realiza una solicitud GET al endpoint '/ingresos-y-gastos' del servidor
    const response = await fetch('https://xeldar93.alwaysdata.net/ingresos-y-gastos', {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Convierte la respuesta en formato JSON
    const data = await response.json();
    
    // Si la respuesta no es exitosa y el status es 401 (Unauthorized), redirecciona al usuario a la página de inicio de sesión
    if (!response.ok) {
      if (response.status === 401) {
        // Limpia el token de autenticación
        localStorage.removeItem('token');
        window.location.href = '/login';
        return; // No es necesario lanzar un error ni seguir ejecutando el código
      }
      throw new Error(data && data.message ? data.message : 'Error al obtener los datos actualizados');
    }    
    
    // Si la respuesta es exitosa, devuelve un objeto con success: true y los datos de la respuesta
    return { success: true, data };
  } catch (error) {
    // Si ocurre un error en la petición, devuelve un objeto con success: false y el mensaje de error
    return { success: false, message: error.message };
  }
}


// Función para agregar datos a la caja (ingresos y gastos)
export async function agregarDatosCaja(token, fecha, ingresoEfectivo, ingresoTarjeta, gastos) {
  try {
    
    const dataToSend = {
      fecha: fecha,
      ingreso_efectivo: ingresoEfectivo,
      ingreso_tarjeta: ingresoTarjeta,
      gastos: gastos
    };

    // Imprime en la consola los datos enviados al servidor para agregar datos a la caja
    console.log('Datos enviados al servidor para agregar datos a la caja:', dataToSend);
    
    // Realiza una solicitud POST al endpoint '/agregar-datos-caja' del servidor
    const response = await fetch('https://xeldar93.alwaysdata.net/agregar-datos-caja', {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    });

    // Convierte la respuesta en formato JSON
    const data = await response.json();

    // Si la respuesta no es exitosa, lanza un error con el mensaje proporcionado por el servidor
    if (!response.ok) {
      throw new Error(data.message || 'Error al agregar datos a la caja');
    }

    // Si la respuesta es exitosa, devuelve un objeto con success: true y los datos de la respuesta
    return { success: true, data };
  } catch (error) {
    // Si ocurre un error en la petición, devuelve un objeto con success: false y el mensaje de error
    return { success: false, message: error.message };
  }
}

// Función para agregar una nueva factura
export async function agregarFactura(token, id_proveedor, id_usuario, fecha, total) {
  try {
    
    const dataToSend = {
      id_proveedor: id_proveedor,
      id_usuario: id_usuario,
      fecha: fecha,
      total: total
    };

    // Imprime en la consola los datos enviados al servidor para agregar factura
    console.log('Datos enviados al servidor para agregar factura', dataToSend);

    // Realiza una solicitud POST al endpoint '/facturas' del servidor
    const response = await fetch('https://xeldar93.alwaysdata.net/facturas', {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    });

    // Si la respuesta no es exitosa, lanza un error con el mensaje proporcionado por el servidor
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al agregar la factura');
    }

    // Convierte la respuesta en formato JSON y la devuelve
    return await response.json();
  } catch (error) {
    // Si ocurre un error en la petición, lanza un error con el mensaje de error
    throw new Error(error.message || 'Error al agregar la factura');
  }
}

// Función para obtener la lista de proveedores
export async function obtenerProveedores(token) {
  try {
    // Realiza una solicitud GET al endpoint '/proveedores' del servidor
    const response = await fetch('https://xeldar93.alwaysdata.net/proveedores', {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    // Convierte la respuesta en formato JSON
    const data = await response.json();

    // Si la respuesta no es exitosa, lanza un error con el mensaje proporcionado por el servidor
    if (!response.ok) {
      throw new Error(data && data.message ? data.message : 'Error al obtener los proveedores');
    }    
    
    // Si la respuesta es exitosa, devuelve un objeto con success: true y los datos de la respuesta
    return { success: true, data };
  } catch (error) {
    // Si ocurre un error en la petición, devuelve un objeto con success: false y el mensaje de error
    return { success: false, message: error.message };
  }
}

// Función para agregar un nuevo proveedor
export async function agregarProveedor(token, nombre, direccion, telefono, email, id_usuario) {
  try {

    const dataToSend = {
      nombre: nombre,
      direccion: direccion,
      telefono: telefono,
      email: email,
      id_usuario: id_usuario
    };

    // Imprime en la consola los datos enviados al servidor para agregar proveedor
    console.log('Datos enviados al servidor para agregar proveedor', dataToSend);

    // Realiza una solicitud POST al endpoint '/proveedores' del servidor
    const response = await fetch('https://xeldar93.alwaysdata.net/proveedores', {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    });

    // Si la respuesta no es exitosa, lanza un error con el mensaje proporcionado por el servidor
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al agregar el proveedor');
    }

    // Convierte la respuesta en formato JSON y la devuelve
    return await response.json();
  } catch (error) {
    // Si ocurre un error en la petición, lanza un error con el mensaje de error
    throw new Error(error.message || 'Error al agregar el proveedor');
  }
}

// Funcion para obtener datos de cajas
export async function obtenerDatosCajas(token) {
  try {
    const response = await fetch('https://xeldar93.alwaysdata.net/cajas', {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const responseData = await response.json();

    // Si la respuesta no es exitosa y el status es 401 (Unauthorized), redirecciona al usuario a la página de inicio de sesión
    if (!response.ok) {
      if (response.status === 401) {
        // Limpia el token de autenticación
        localStorage.removeItem('token');
        // Redirecciona al usuario a la página de inicio de sesión
        window.location.href = '/login';
        // Detiene la ejecución de la función
        return;
      }
      // Lanza un error con el mensaje proporcionado por el servidor
      throw new Error(responseData && responseData.message ? responseData.message : 'Error al obtener los datos de cajas');
    }

    // Si la respuesta es exitosa, devuelve los datos de la respuesta
    return { success: true, data: responseData.cajas.map(caja => ({
      fecha: caja.fecha,
      ingreso_efectivo: caja.ingreso_efectivo,
      ingreso_tarjeta: caja.ingreso_tarjeta,
      gastos: caja.gastos,
    })) };
  } catch (error) {
    // Si ocurre un error en la petición, devuelve un objeto con success: false y el mensaje de error
    return { success: false, message: error.message };
  }
}

// Funcion para obtener datos de facturas
export async function obtenerDatosFacturas(token) {
  try {
    const response = await fetch('https://xeldar93.alwaysdata.net/facturas', {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const responseData = await response.json();

    // Si la respuesta no es exitosa y el status es 401 (Unauthorized), redirecciona al usuario a la página de inicio de sesión
    if (!response.ok) {
      if (response.status === 401) {
        // Limpia el token de autenticación
        localStorage.removeItem('token');
        // Redirecciona al usuario a la página de inicio de sesión
        window.location.href = '/login';
        // Detiene la ejecución de la función
        return;
      }
      // Lanza un error con el mensaje proporcionado por el servidor
      throw new Error(responseData && responseData.message ? responseData.message : 'Error al obtener los datos de facturas');
    }

    // Si la respuesta es exitosa, devuelve los datos de la respuesta
    return { success: true, data: responseData.facturas.map(factura => ({
      id_proveedor: factura.id_proveedor,
      id_usuario: factura.id_usuario,
      fecha: factura.fecha,
      total: factura.total,
    })) };
  } catch (error) {
    // Si ocurre un error en la petición, devuelve un objeto con success: false y el mensaje de error
    return { success: false, message: error.message };
  }
}