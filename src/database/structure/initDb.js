import {
	errorLog,
	infoLog,
	succesLog,
	warningLog,
} from "../../utils/logger.js";
import { Db } from "./db.js";

async function initDB() {
	try {
		warningLog("Eliminando base de datos si existe");
		await Db.query("DROP DATABASE IF EXISTS citas_medicas");

		await Db.query("CREATE DATABASE citas_medicas");
		succesLog("Base de datos citas_medicas creada.");

		await Db.query("USE citas_medicas");
		infoLog("DB en uso: citas_medicas");

		warningLog("Eliminando tablas si existen");
		await Db.query(
			"DROP TABLE IF EXISTS ratings, responses, consultations, users, specialities"
		);

		infoLog("Creando tablas...");

		await Db.query(`
            CREATE TABLE specialities (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

		succesLog("Tabla Specialities creada.");

		await Db.query(`
            CREATE TABLE users (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                firstName VARCHAR(50) NOT NULL,
                lastName VARCHAR(100) DEFAULT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                userType ENUM('paciente', 'doctor') NOT NULL,
                userName VARCHAR(255) NOT NULL,
                biography VARCHAR(500) DEFAULT NULL,
                avatar VARCHAR(255) DEFAULT NULL,
                specialityId INT DEFAULT NULL,
                experience INT DEFAULT NULL,
                codigoMedico INT DEFAULT NULL,
                validationCode INT DEFAULT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (specialityId) REFERENCES specialities(id)
            )
        `);

		succesLog("Tabla Users creada.");

		await Db.query(`
            CREATE TABLE consultations (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                date DATETIME NOT NULL,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                specialityId INT NOT NULL,
                severity ENUM('high', 'medium', 'low') NOT NULL,
                patientId INT NOT NULL,
                doctorId INT NOT NULL,
                status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (specialityId) REFERENCES specialities(id),
                FOREIGN KEY (patientId) REFERENCES users(id),
                FOREIGN KEY (doctorId) REFERENCES users(id)
            )
        `);

		succesLog("Tabla consultations creada.");

		await Db.query(`
            CREATE TABLE responses (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                content VARCHAR(5000) NOT NULL,
                consultationId INT NOT NULL,
                rating INT DEFAULT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (consultationId) REFERENCES consultations(id),
            )
        `);

		succesLog("Tabla responses creada.");

		infoLog("¡Todas las tablas creadas exitosamente!");
		process.exit(0);
	} catch (error) {
		errorLog("Error al crear las tablas:", error);
		process.exit(1);
	}
}

initDB();
