//server.js
// importamos modulos
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// instanciamos express
const app = express();

app.get('/', (req, res) => {
  res.send('¡Servidor en línea!');
});


app.use(cors({
  origin: 'https://proyecto-hermes-app.netlify.app', // El origen de tu aplicación React
  methods: 'GET,POST', 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));



// parsear peticiones
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configuracion conexion a base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// conectamos a base de datos
connection.connect(error => {
  if (error) throw error;
  console.log('Conectado a la base de datos.');
});

// ruta para el registro de usuarios
app.post('/registro', async (req, res) => {
  // extraemos los datos del cuerpo de la peticion
  const { nombre, email, contraseña } = req.body;

  console.log('Datos recibidos en la solicitud POST de registro:', { nombre, email, contraseña });

   // Verificamos que se hayan recibido todos los datos necesarios
   if (!nombre || !email || !contraseña || !email.includes('@')) {
  return res.status(400).send('Datos de registro inválidos.');
}

  // hasheamos la contraseña antes de guardarla y añadimos sal
  const contraseñaHasheada = await bcrypt.hash(contraseña, 10);

  // creamos el usuario en la base de datos
  const query = 'INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)';
  
  connection.query(query, [nombre, email, contraseñaHasheada], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      return res.status(500).send('Error al registrar el usuario: '+ error.message);
    }
    res.status(201).json({ success: true, message: 'Usuario registrado con éxito.'});
  });
});

// ruta para el login de usuarios
app.post('/login', (req, res) => {
  // extraemos los datos del cuerpo de la petición
  const { email, contraseña } = req.body;

  console.log('Datos recibidos en la solicitud de inicio de sesión:', { email, contraseña });

  // hacemos un select para buscar al usuario por su correo electrónico
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  connection.query(query, [email], async (error, results) => {
    if (error) {
      return res.status(500).send('Error al iniciar sesión.');
    }
    if (results.length === 0) {
      return res.status(401).send('Credenciales incorrectas.');
    }

    // comparamos la contraseña hasheada con la proporcionada
    const esContraseñaValida = await bcrypt.compare(contraseña, results[0].contraseña);
    if (!esContraseñaValida) {
      return res.status(401).send('Credenciales incorrectas.');
    }

    // generamos un nuevo token jwt
    const nuevoToken = jwt.sign({ id_usuario: results[0].id_usuario }, 'recorcholis', { expiresIn: '1h' });

    // Guardamos el nuevo token en el almacenamiento local con cookie
    res.cookie('recorcholis', nuevoToken, { httpOnly: true });

    // respondemos con el nuevo token
    console.log('token pasado a front:', nuevoToken);
    res.status(200).json({ token: nuevoToken, message: 'sesion activa' });
    
  });
});


// middleware para verificar el token jwt y manejar la expiración de la sesión
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; 

  if (!authHeader) {
    return res.status(403).send('Se requiere un token para esta operación.');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'recorcholis', (error, decoded) => {
    if (error) {
      console.log('Error al verificar el token:', error);
      // Si el token ha expirado, enviar una respuesta al cliente indicando que el token ha expirado
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'El token ha expirado' });
      }
      return res.status(403).send('Token inválido.');
    }
    req.id_usuario = decoded.id_usuario;
    next();
  });
};


// middleware para manejar las rutas protegidas
const protegerRutas = (req, res, next) => {
  if (req.path !== '/login' && req.path !== '/registro') {
    verificarToken(req, res, next);
  } else {
    next();
  }
};

app.use(protegerRutas);


// Ruta para obtener ingresos y gastos
app.get('/ingresos-y-gastos', verificarToken, (req, res) => {
  const id_usuario = req.id_usuario; // Obtener el id_usuario del token verificado

  // Realizar la consulta de ingresos
  connection.query('SELECT * FROM ingresos WHERE id_usuario = ?', [id_usuario], (errorIngresos, resultadosIngresos) => {
      if (errorIngresos) {
          console.error('Error al ejecutar la consulta de ingresos:', errorIngresos);
          return res.status(500).send('Error al obtener los ingresos');
      }

      // Realizar la consulta de gastos
      connection.query('SELECT * FROM gastos WHERE id_usuario = ?', [id_usuario], (errorGastos, resultadosGastos) => {
          if (errorGastos) {
              console.error('Error al ejecutar la consulta de gastos:', errorGastos);
              return res.status(500).send('Error al obtener los gastos');
          }

          // Envía la respuesta al cliente con los datos obtenidos
          res.status(200).json({
              success: true,
              ingresos: resultadosIngresos,
              gastos: resultadosGastos
          });
      });
  });
});

// Ruta para agregar datos a la tabla cajas
app.post('/agregar-datos-caja', verificarToken, (req, res) => {
  const id_usuario = req.id_usuario; // Obtener el id_usuario del token verificado
  let { fecha, ingreso_efectivo, ingreso_tarjeta, gastos } = req.body; // Extraer los datos del cuerpo de la petición

  // Verificar que se hayan recibido todos los datos necesarios
  if (!ingreso_efectivo || !ingreso_tarjeta || !gastos) {
    return res.status(400).send('Datos de la caja incompletos.');
  }

  // Si no se proporciona una fecha, utilizar el timestamp actual
  if (!fecha) {
    fecha = new Date(); // Fecha actual
  } else {
    // Si se proporciona una fecha, convertirla al formato correcto
    fecha = new Date(fecha);
  }

  // Imprimir o registrar el id_usuario recibido
  console.log('datos recibidos para insertar recibido:', id_usuario, fecha, ingreso_efectivo, ingreso_tarjeta, gastos);

  // Primero, desactivar las verificaciones de claves foráneas
  connection.query('SET FOREIGN_KEY_CHECKS=0;', (error) => {
    if (error) {
      console.error('Error al desactivar las verificaciones de claves foráneas:', error);
      return res.status(500).send('Error al agregar datos a la caja: '+ error.message);
    }

    // Crear la consulta SQL para insertar los datos en la tabla cajas
    const insertQuery = 'INSERT INTO cajas (id_usuario, fecha, ingreso_efectivo, ingreso_tarjeta, gastos) VALUES (?, ?, ?, ?, ?)';
    
    // Ejecutar la consulta SQL para insertar los datos
    connection.query(insertQuery, [id_usuario, fecha, ingreso_efectivo, ingreso_tarjeta, gastos], (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta para agregar datos a la caja:', error);
        // Después de cualquier error, asegúrate de activar las verificaciones de claves foráneas
        connection.query('SET FOREIGN_KEY_CHECKS=1;', () => {});
        return res.status(500).send('Error al agregar datos a la caja: '+ error.message);
      }

      // Después de la inserción, activar las verificaciones de claves foráneas
      connection.query('SET FOREIGN_KEY_CHECKS=1;', (error) => {
        if (error) {
          console.error('Error al activar las verificaciones de claves foráneas:', error);
          return res.status(500).send('Error al agregar datos a la caja: '+ error.message);
        }
        res.status(201).json({ success: true, message: 'Datos agregados a la caja con éxito.' });
        console.log('datos agregados a caja: ', id_usuario, fecha, ingreso_efectivo, ingreso_tarjeta, gastos)
      });
    });
  });
});

// Ruta para agregar una factura
app.post('/facturas', verificarToken, (req, res) => {
  const id_usuario = req.id_usuario;
  let { id_proveedor, fecha, total } = req.body;

  // Si no se proporciona una fecha, utilizar el timestamp actual
  if (!fecha) {
    fecha = new Date(); // Fecha actual
  } else {
    // Si se proporciona una fecha, convertirla al formato correcto
    fecha = new Date(fecha);
  }

  if (!id_proveedor || !id_usuario || !fecha || !total) {
    return res.status(400).send('Datos de la factura incompletos.');
  }

  //verificamos los datos recibidos
  console.log('datos recibidos para insertar:', id_proveedor, id_usuario, fecha, total);

  // Primero, desactivar las verificaciones de claves foráneas
  connection.query('SET FOREIGN_KEY_CHECKS=0;', (error) => {
    if (error) {
      console.error('Error al desactivar las verificaciones de claves foráneas:', error);
      return res.status(500).send('Error al agregar datos a la caja: '+ error.message);
    }

  const insertQuery = 'INSERT INTO facturas (id_proveedor, id_usuario, fecha, total) VALUES (?, ?, ?, ?)';
  connection.query(insertQuery, [id_proveedor, id_usuario, fecha, total], (error, results) => {
    if (error) {
      console.error('Error al agregar la factura:', error);
      // Después de cualquier error, asegúrate de activar las verificaciones de claves foráneas
      connection.query('SET FOREIGN_KEY_CHECKS=1;', () => {});
      return res.status(500).send('Error al agregar la factura: ' + error.message);
    }
    // Después de la inserción, activar las verificaciones de claves foráneas
    connection.query('SET FOREIGN_KEY_CHECKS=1;', (error) => {
      if (error) {
        console.error('Error al activar las verificaciones de claves foráneas:', error);
        return res.status(500).send('Error al agregar datos a la caja: '+ error.message);
      }
    res.status(201).json({ success: true, message: 'Factura agregada con éxito.' });
      });
    });
  });
});

// Ruta para obtener la lista de proveedores
app.get('/proveedores', verificarToken, (req, res) => {
  const id_usuario = req.id_usuario;

  connection.query('SELECT * FROM proveedores WHERE id_usuario = ?', [id_usuario], (error, results) => {
    if (error) {
      console.error('Error al obtener los proveedores:', error);
      return res.status(500).send('Error al obtener los proveedores: ' + error.message);
    }
    res.status(200).json({ success: true, proveedores: results });
  });
});

// Ruta para agregar un nuevo proveedor
app.post('/proveedores', verificarToken, (req, res) => {
  const id_usuario = req.id_usuario;
  const { nombre, direccion, telefono, email } = req.body;
  

  if (!nombre || !direccion || !telefono || !email || !id_usuario) {
    return res.status(400).send('Datos del proveedor incompletos.');
  }
  //verificamos los datos recibidos
  console.log('datos recibidos para insertar:', nombre, direccion, telefono, email, id_usuario);

  // Primero, desactivar las verificaciones de claves foráneas
  connection.query('SET FOREIGN_KEY_CHECKS=0;', (error) => {
    if (error) {
      console.error('Error al desactivar las verificaciones de claves foráneas:', error);
      return res.status(500).send('Error al agregar datos a la caja: '+ error.message);
    }

  const query = 'INSERT INTO proveedores (nombre, direccion, telefono, email, id_usuario) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [nombre, direccion, telefono, email, id_usuario], (error, results) => {
    if (error) {
      console.error('Error al agregar el proveedor:', error);
      // Después de cualquier error, asegúrate de activar las verificaciones de claves foráneas
      connection.query('SET FOREIGN_KEY_CHECKS=1;', () => {});
      return res.status(500).send('Error al agregar el proveedor: ' + error.message);
    }

    // Después de la inserción, activar las verificaciones de claves foráneas
    connection.query('SET FOREIGN_KEY_CHECKS=1;', (error) => {
      if (error) {
        console.error('Error al activar las verificaciones de claves foráneas:', error);
        return res.status(500).send('Error al agregar datos a la caja: '+ error.message);
      }
    res.status(201).json({ success: true, message: 'Proveedor agregado con éxito.' });
    console.log('Datos de proveedor agregados: ', nombre, direccion, telefono, email, id_usuario);
      });
    });
  });
});

// Ruta para obtener cajas
app.get('/cajas', verificarToken, (req, res) => {
  const id_usuario = req.id_usuario; // Obtener el id_usuario del token verificado

  // Realizar la consulta de cajas
  connection.query('SELECT * FROM cajas WHERE id_usuario = ?', [id_usuario], (errorCajas, resultadosCajas) => {
      if (errorCajas) {
          console.error('Error al ejecutar la consulta de cajas:', errorCajas);
          return res.status(500).send('Error al obtener las cajas');
      }

      // Envía la respuesta al cliente con los datos obtenidos
      res.status(200).json({
        success: true,
        cajas: resultadosCajas
    });
  });
});

// Ruta para obtener facturas
app.get('/facturas', verificarToken, (req, res) => {
  const id_usuario = req.id_usuario; // Obtener el id_usuario del token verificado

  // Realizar la consulta de facturas
  connection.query('SELECT * FROM facturas WHERE id_usuario = ?', [id_usuario], (errorFacturas, resultadosFacturas) => {
      if (errorFacturas) {
          console.error('Error al ejecutar la consulta de facturas:', errorFacturas);
          return res.status(500).send('Error al obtener las facturas');
      }

      // Envía la respuesta al cliente con los datos obtenidos
      res.status(200).json({
        success: true,
        facturas: resultadosFacturas
    });
  });
});

  const PORT = process.env.PORT || 3001; //puerto del front
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});