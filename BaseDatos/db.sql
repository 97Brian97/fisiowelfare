CREATE DATABASE fisiowelfare;

CREATE TABLE `pacientes` (
	`id_paciente` SERIAL NOT NULL AUTO_INCREMENT,
	`tipo_documento` VARCHAR(15) NOT NULL,
	`numero_documento` BIGINT NOT NULL UNIQUE,
	`nombres` VARCHAR(200) NOT NULL CHECK (char_length(nombre) >= 3),
	`apellidos` VARCHAR(200) NOT NULL CHECK (char_length(nombre) >= 3),
	`fecha_nacimiento` DATE NOT NULL,
	`sexo` VARCHAR(25) NOT NULL,
	`telefono` VARCHAR(20) UNIQUE CHECK (telefono ~ '^[0-9]+$'),
	`email` VARCHAR(200) UNIQUE NOT NULL CHECK (position('@' in email) > 1),
	`direccion` VARCHAR(100),
	`contrasena` VARCHAR(200) NOT NULL,
	`fecha_registro` DATE NOT NULL,
	PRIMARY KEY(`id_paciente`)
);

CREATE TABLE `usuarios` (
	`id_usuario` SERIAL NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(255) NOT NULL,
	`apellido` VARCHAR(255) NOT NULL,
	`rol` VARCHAR(255),
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`contrasena` VARCHAR(255) NOT NULL,
	`fecha_registro` DATE NOT NULL,
	PRIMARY KEY(`id_usuario`)
);

CREATE TABLE `citas` (
	`id_cita` SERIAL NOT NULL AUTO_INCREMENT,
	`id_paciente` INTEGER NOT NULL,
	`id_usuario` INTEGER NULL,
	`fecha_cita` DATE NOT NULL,
	`hora_inicio` TIME NOT NULL,
	`estado` VARCHAR(255),
	`observaciones` TEXT,
	PRIMARY KEY(`id_cita`)
);

CREATE TABLE `historias_clinicas` (
	`id_historia_clinica` SERIAL NOT NULL AUTO_INCREMENT,
	`id_paciente` INTEGER NOT NULL,
	`id_cita` INTEGER NOT NULL,
	`fecha_registro` DATE NOT NULL,
	`motivo_consulta` TEXT,
	`antecedentes` TEXT,
	`diagnostico` TEXT,
	`tratamiento` TEXT,
	`evolucion` TEXT,
	`observaciones` TEXT,
	`id_usuario` INTEGER NOT NULL,
	PRIMARY KEY(`id_historia_clinica`)
);

CREATE TABLE `tratamiento` (
	`id_tratamiento` SERIAL NOT NULL AUTO_INCREMENT,
	`id_historia` INTEGER NOT NULL,
	`nombre_procedimiento` VARCHAR(255) NOT NULL,
	`descripcion` TEXT,
	`fecha` DATE NOT NULL,
	`resultado` TEXT,
	PRIMARY KEY(`id_tratamiento`)
);

-- Relaciones
ALTER TABLE `citas`
ADD FOREIGN KEY(`id_paciente`) REFERENCES `pacientes`(`id_paciente`)
ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE `citas`
ADD FOREIGN KEY(`id_usuario`) REFERENCES `usuarios`(`id_usuario`)
ON UPDATE NO ACTION ON DELETE SET NULL;

ALTER TABLE `historias_clinicas`
ADD FOREIGN KEY(`id_paciente`) REFERENCES `pacientes`(`id_paciente`)
ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE `historias_clinicas`
ADD FOREIGN KEY(`id_cita`) REFERENCES `citas`(`id_cita`)
ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE `historias_clinicas`
ADD FOREIGN KEY(`id_usuario`) REFERENCES `usuarios`(`id_usuario`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `tratamiento`
ADD FOREIGN KEY(`id_historia_clinica`) REFERENCES `historias_clinicas`(`id_historia_clinica`)
ON UPDATE NO ACTION ON DELETE CASCADE;
