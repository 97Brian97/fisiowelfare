-- TABLA PACIENTES
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

-- TABLA USUARIOS (administradores, terapeutas)
CREATE TABLE `usuarios` (
    `id_usuario` INT NOT NULL AUTO_INCREMENT,
    `tipo_documento` VARCHAR(50),
    `numero_documento` VARCHAR(50) UNIQUE,
    `nombre` VARCHAR(255),
    `apellido` VARCHAR(255),
    `edad` INT CHECK (edad BETWEEN 0 AND 120),
    `rol` ENUM('admin','fisioterapeuta') NOT NULL,
    `email` VARCHAR(255) UNIQUE,
    `contrasena` VARCHAR(255),
    `fecha_registro` DATE DEFAULT (CURRENT_DATE),
    `estado` ENUM('activo','inactivo') DEFAULT 'activo',
    PRIMARY KEY(`id_usuario`)
);

-- TABLA PLANES
CREATE TABLE `planes` (
    `id_plan` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT,
    `numero_sesiones` INT NOT NULL CHECK (numero_sesiones > 0),
    `precio` DECIMAL(10,2) NOT NULL CHECK (precio > 0)
);

-- TABLA RELACIÓN PACIENTE - PLAN
CREATE TABLE `pacientes_planes` (
    `id_paciente_plan` INT AUTO_INCREMENT PRIMARY KEY,
    `id_paciente` INT NOT NULL,
    `id_plan` INT NOT NULL,
    `fecha_inicio` DATE DEFAULT (CURRENT_DATE),
    `sesiones_restantes` INT NOT NULL,
    `estado` ENUM('activo','finalizado') DEFAULT 'activo',
    FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (`id_plan`) REFERENCES `planes`(`id_plan`)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- TABLA CITAS
CREATE TABLE `citas` (
  `id_cita` INT NOT NULL AUTO_INCREMENT,
  `id_paciente` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `id_paciente_plan` INT DEFAULT NULL, -- opcional, si quieres enlazar con pacientes_planes
  `fecha_cita` DATE NOT NULL,
  `hora_inicio` DATETIME,
  `hora_fin` DATETIME,
  `tipo_consulta` ENUM('primera_vez','fisioterapia_convencional','fisioterapia_invasiva') NOT NULL,
  `terapia` VARCHAR(255) NOT NULL,
  `estado` ENUM('programada','atendida','cancelada') NOT NULL DEFAULT 'programada',
  `observaciones` TEXT,
  `costo` DECIMAL(10,2) DEFAULT 50000.00,
  PRIMARY KEY (`id_cita`),
  CONSTRAINT `fk_citas_paciente` FOREIGN KEY (`id_paciente`)
    REFERENCES `pacientes` (`id_paciente`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_citas_usuario` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_citas_paciente_plan` FOREIGN KEY (`id_paciente_plan`)
    REFERENCES `pacientes_planes` (`id_paciente_plan`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA HISTORIAS CLÍNICAS
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
  PRIMARY KEY (`id_historia`),
  CONSTRAINT `fk_historia_paciente` FOREIGN KEY (`id_paciente`)
    REFERENCES `pacientes` (`id_paciente`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_historia_cita` FOREIGN KEY (`id_cita`)
    REFERENCES `citas` (`id_cita`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_historia_usuario` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA TRATAMIENTOS
CREATE TABLE `tratamientos` (
  `id_tratamiento` INT NOT NULL AUTO_INCREMENT,
  `id_historia` INT NOT NULL,
  `nombre_procedimiento` VARCHAR(255),
  `descripcion` TEXT,
  `resultado` TEXT,
  `estado` ENUM('pendiente','en_progreso','finalizado') NOT NULL DEFAULT 'pendiente',
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE DEFAULT NULL,
  PRIMARY KEY (`id_tratamiento`),
  CONSTRAINT `fk_tratamientos_historia` FOREIGN KEY (`id_historia`)
    REFERENCES `historias_clinicas` (`id_historia`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `chk_tratamientos_fecha` CHECK (`fecha_fin` IS NULL OR `fecha_fin` >= `fecha_inicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA EVOLUCIONES
CREATE TABLE `evoluciones` (
  `id_evolucion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_historia` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `informe_evolucion` TEXT NOT NULL,
  CONSTRAINT `fk_evoluciones_historia` FOREIGN KEY (`id_historia`)
    REFERENCES `historias_clinicas` (`id_historia`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;