CREATE TABLE `pacientes` (
    `id_paciente` INT NOT NULL AUTO_INCREMENT,
    `tipo_documento` VARCHAR(50),
    `numero_documento` VARCHAR(50) UNIQUE,
    `nombres` VARCHAR(255),
    `apellidos` VARCHAR(255),
    `fecha_nacimiento` DATE,
    `edad` INT CHECK (edad BETWEEN 0 AND 120),
    `sexo` VARCHAR(50),
    `telefono` VARCHAR(20) UNIQUE CHECK (telefono REGEXP '^[0-9]+$'),
    `email` VARCHAR(150) UNIQUE NOT NULL CHECK (LOCATE('@', email) > 1),
    `direccion` VARCHAR(255),
    `contrasena` VARCHAR(255),
    `fecha_registro` DATE DEFAULT (CURRENT_DATE),
    `sesiones` INT CHECK (sesiones >= 0),
    `estado` ENUM('activo','inactivo') DEFAULT 'activo',
    PRIMARY KEY(`id_paciente`)
);

CREATE TABLE `usuarios` (
    `id_usuario` INT NOT NULL AUTO_INCREMENT,
    `tipo_documento` VARCHAR(50),
    `numero_documento` VARCHAR(50) UNIQUE,
    `nombre` VARCHAR(255),
    `apellido` VARCHAR(255),
    `edad` INT CHECK (edad BETWEEN 0 AND 120),
    `rol` ENUM('admin','fisioterapeuta','recepcion') NOT NULL,
    `email` VARCHAR(255) UNIQUE,
    `contrasena` VARCHAR(255),
    `fecha_registro` DATE DEFAULT (CURRENT_DATE),
    `estado` ENUM('activo','inactivo') DEFAULT 'activo',
    PRIMARY KEY(`id_usuario`)
);

CREATE TABLE `citas` (
    `id_cita` INT NOT NULL AUTO_INCREMENT,
    `id_paciente` INT NOT NULL,
    `id_usuario` INT NOT NULL,
    `fecha_cita` DATE NOT NULL, 
    `hora_inicio` DATETIME,
    `hora_fin` DATETIME,
    `estado` ENUM('programada','atendida','cancelada') NOT NULL DEFAULT 'programada',
    `observaciones` TEXT,
    `costo` DECIMAL(10,2) DEFAULT 50000.00,
    PRIMARY KEY(`id_cita`),
    FOREIGN KEY(`id_paciente`) REFERENCES `pacientes`(`id_paciente`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY(`id_usuario`) REFERENCES `usuarios`(`id_usuario`)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `historias_clinicas` (
    `id_historia` INT NOT NULL AUTO_INCREMENT,
    `id_paciente` INT NOT NULL,
    `id_cita` INT NOT NULL,
    `fecha_registro` DATE DEFAULT (CURRENT_DATE),
    `motivo_consulta` TEXT,
    `antecedentes` TEXT,
    `diagnostico` TEXT,
    `tratamiento` TEXT,
    `evolucion` TEXT,
    `observaciones` TEXT,
    `id_usuario` INT NOT NULL,
    `estado` ENUM('abierta','cerrada') NOT NULL DEFAULT 'abierta',
    PRIMARY KEY(`id_historia`),
    FOREIGN KEY(`id_paciente`) REFERENCES `pacientes`(`id_paciente`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY(`id_cita`) REFERENCES `citas`(`id_cita`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY(`id_usuario`) REFERENCES `usuarios`(`id_usuario`)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `tratamientos` (
    `id_tratamiento` INT NOT NULL AUTO_INCREMENT,
    `id_historia` INT NOT NULL,
    `nombre_procedimiento` VARCHAR(255),
    `descripcion` TEXT,
    `resultado` TEXT,
    `estado` ENUM('pendiente','en_progreso','finalizado') NOT NULL DEFAULT 'pendiente',
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE CHECK(fecha_fin >= fecha_inicio),
    PRIMARY KEY(`id_tratamiento`),
    FOREIGN KEY(`id_historia`) REFERENCES `historias_clinicas`(`id_historia`)
        ON UPDATE CASCADE ON DELETE RESTRICT
);