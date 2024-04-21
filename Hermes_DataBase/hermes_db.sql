-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 19-04-2024 a las 21:23:50
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hermes_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cajas`
--

CREATE TABLE `cajas` (
  `id_caja` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `ingreso_efectivo` decimal(10,2) NOT NULL,
  `ingreso_tarjeta` decimal(10,2) NOT NULL,
  `gastos` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `cajas`
--

INSERT INTO `cajas` (`id_caja`, `id_usuario`, `fecha`, `ingreso_efectivo`, `ingreso_tarjeta`, `gastos`) VALUES
(117, 1, '2024-01-15 00:00:00', 7800.00, 2200.00, 5100.00),
(118, 1, '2024-02-15 00:00:00', 6800.00, 4500.00, 7500.00),
(119, 1, '2024-03-15 00:00:00', 8900.00, 1430.00, 3000.00),
(120, 1, '2024-04-15 11:39:38', 5000.00, 1000.00, 5000.00),
(121, 1, '2023-12-15 00:00:00', 5020.00, 1030.00, 1560.00),
(122, 1, '2024-05-07 00:00:00', 1233.00, 1212.00, 852.00),
(123, 1, '2023-11-15 00:00:00', 1234.00, 1234.00, 1111.00),
(124, 1, '2023-10-11 00:00:00', 4561.00, 4231.00, 2301.00),
(125, 1, '2023-09-13 00:00:00', 1452.00, 1245.00, 1452.00),
(126, 1, '2023-09-13 00:00:00', 1452.00, 1245.00, 1452.00),
(127, 1, '2023-08-15 00:00:00', 2563.00, 2563.00, 2563.00),
(128, 1, '2023-07-15 00:00:00', 4521.00, 1254.00, 2563.00),
(129, 1, '2023-06-15 00:00:00', 1236.00, 1234.00, 1235.00),
(130, 1, '2024-05-07 00:00:00', 1234.00, 1234.00, 1232.00),
(131, 1, '2024-04-16 00:00:00', 10.00, 10.00, 10.00);

--
-- Disparadores `cajas`
--
DELIMITER $$
CREATE TRIGGER `after_caja_gasto_insert` AFTER INSERT ON `cajas` FOR EACH ROW BEGIN
    -- Inserta el nuevo gasto en la tabla 'gastos' junto con la fecha y el ID de usuario
    INSERT INTO gastos (fecha, total_gastos, id_usuario) VALUES (NEW.fecha, NEW.gastos, NEW.id_usuario);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_caja_ingreso_insert` AFTER INSERT ON `cajas` FOR EACH ROW BEGIN
    -- Inserta el nuevo ingreso en la tabla 'ingresos' junto con la fecha y el ID de usuario
    INSERT INTO ingresos (fecha, total_ingresos, id_usuario) VALUES (NEW.fecha, NEW.ingreso_efectivo + NEW.ingreso_tarjeta, NEW.id_usuario);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `id_factura` int(11) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `facturas`
--

INSERT INTO `facturas` (`id_factura`, `id_proveedor`, `id_usuario`, `fecha`, `total`) VALUES
(21, 1, 1, '2024-03-12 00:00:00', 256.00),
(22, 7, 1, '2024-04-03 00:00:00', 325.00),
(23, 9, 1, '2024-04-04 00:00:00', 300.00),
(24, 1, 1, '2024-04-17 00:00:00', 400.00),
(25, 2, 1, '2024-04-09 00:00:00', 500.00),
(26, 9, 1, '2024-04-16 00:00:00', 100.00);

--
-- Disparadores `facturas`
--
DELIMITER $$
CREATE TRIGGER `after_factura_insert` AFTER INSERT ON `facturas` FOR EACH ROW BEGIN
    -- Inserta el nuevo gasto en la tabla 'gastos' junto con la fecha y el ID de usuario
    INSERT INTO gastos (fecha, total_gastos, id_usuario) VALUES (NEW.fecha, NEW.total, NEW.id_usuario);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos`
--

CREATE TABLE `gastos` (
  `id_gasto` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_gastos` decimal(10,2) DEFAULT 0.00,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `gastos`
--

INSERT INTO `gastos` (`id_gasto`, `fecha`, `total_gastos`, `id_usuario`) VALUES
(134, '2024-01-15 00:00:00', 5100.00, 1),
(135, '2024-02-15 00:00:00', 7500.00, 1),
(136, '2024-03-15 00:00:00', 3000.00, 1),
(137, '2024-04-15 11:39:38', 5000.00, 1),
(138, '2023-12-15 00:00:00', 1560.00, 1),
(139, '2024-05-07 00:00:00', 852.00, 1),
(140, '2023-11-15 00:00:00', 1111.00, 1),
(141, '2023-10-11 00:00:00', 2301.00, 1),
(142, '2023-09-13 00:00:00', 1452.00, 1),
(143, '2023-09-13 00:00:00', 1452.00, 1),
(144, '2023-08-15 00:00:00', 2563.00, 1),
(145, '2023-07-15 00:00:00', 2563.00, 1),
(146, '2023-06-15 00:00:00', 1235.00, 1),
(147, '2024-05-07 00:00:00', 1232.00, 1),
(148, '2024-04-16 00:00:00', 10.00, 1),
(149, '2024-03-12 00:00:00', 256.00, 1),
(150, '2024-04-03 00:00:00', 325.00, 1),
(151, '2024-04-04 00:00:00', 300.00, 1),
(152, '2024-04-17 00:00:00', 400.00, 1),
(153, '2024-04-09 00:00:00', 500.00, 1),
(154, '2024-04-16 00:00:00', 100.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingresos`
--

CREATE TABLE `ingresos` (
  `id_ingreso` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_ingresos` decimal(10,2) DEFAULT 0.00,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ingresos`
--

INSERT INTO `ingresos` (`id_ingreso`, `fecha`, `total_ingresos`, `id_usuario`) VALUES
(103, '2024-01-15 00:00:00', 10000.00, 1),
(104, '2024-02-15 00:00:00', 11300.00, 1),
(105, '2024-03-15 00:00:00', 10330.00, 1),
(106, '2024-04-15 11:39:38', 6000.00, 1),
(107, '2023-12-15 00:00:00', 6050.00, 1),
(108, '2024-05-07 00:00:00', 2445.00, 1),
(109, '2023-11-15 00:00:00', 2468.00, 1),
(110, '2023-10-11 00:00:00', 8792.00, 1),
(111, '2023-09-13 00:00:00', 2697.00, 1),
(112, '2023-09-13 00:00:00', 2697.00, 1),
(113, '2023-08-15 00:00:00', 5126.00, 1),
(114, '2023-07-15 00:00:00', 5775.00, 1),
(115, '2023-06-15 00:00:00', 2470.00, 1),
(116, '2024-05-07 00:00:00', 2468.00, 1),
(117, '2024-04-16 00:00:00', 20.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre`, `direccion`, `telefono`, `email`, `id_usuario`) VALUES
(1, 'luz', 'calle bombilla', '6526526565', 'luz@gmail.com', 1),
(2, 'bebida', 'calle poligono', '5223651262', 'bebida@gmail.com', 1),
(7, 'cocacola', 'calle jubilo 1', '123456789', 'cocacola@gmail.com', 1),
(8, 'Endesa', 'calle Luz', '456456789', 'endesa@luz.com', 1),
(9, 'Agua', 'calle rio', '456214895', 'agua@agua.com', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `contraseña`, `fecha_creacion`) VALUES
(1, 'alicia', 'alicia@gmail.com', '$2b$10$ZY9aQpHdCE3k4VI06xmioeWsDwciL/xz5sYBFFD9RpYDSN5OOKMwK', '2024-04-02 08:22:12'),
(2, 'jaime', 'jaime@gmail.com', '$2b$10$kyQQ9qD.RuB53bb9tFSlTevKRLl8hB6Lg8eMc1t.dBFI5q3BXzaOG', '2024-04-02 08:22:54');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cajas`
--
ALTER TABLE `cajas`
  ADD PRIMARY KEY (`id_caja`),
  ADD KEY `cajas_fk_usuario` (`id_usuario`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD PRIMARY KEY (`id_gasto`),
  ADD KEY `gastos_fk_usuario` (`id_usuario`);

--
-- Indices de la tabla `ingresos`
--
ALTER TABLE `ingresos`
  ADD PRIMARY KEY (`id_ingreso`),
  ADD KEY `ingresos_fk_usuario` (`id_usuario`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_usuario_proveedor` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cajas`
--
ALTER TABLE `cajas`
  MODIFY `id_caja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
  MODIFY `id_gasto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT de la tabla `ingresos`
--
ALTER TABLE `ingresos`
  MODIFY `id_ingreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cajas`
--
ALTER TABLE `cajas`
  ADD CONSTRAINT `cajas_fk_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  ADD CONSTRAINT `facturas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD CONSTRAINT `gastos_fk_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `ingresos`
--
ALTER TABLE `ingresos`
  ADD CONSTRAINT `ingresos_fk_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `fk_usuario_proveedor` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
