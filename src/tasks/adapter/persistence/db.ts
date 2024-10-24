import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

async function setupDatabase() {
	const connection = await mysql.createConnection({
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
	});

	// Criando tabela de usuários
	await connection.query(`CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(255) NOT NULL,
		password VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL UNIQUE
	)`);

	// Criando tabela de projetos
	await connection.query(`CREATE TABLE IF NOT EXISTS projects (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		description TEXT,
		createdAt VARCHAR(255)
	)`);

	// Tabela de associação entre projetos e usuários (Muitos-para-Muitos)
	await connection.query(`CREATE TABLE IF NOT EXISTS project_users (
		project_id INT,
		user_id INT,
		PRIMARY KEY (project_id, user_id),
		FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)`);

	// Criando tabela de tarefas
	await connection.query(`CREATE TABLE IF NOT EXISTS tasks (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		description TEXT,
		status ENUM('active', 'concluded', 'removed') NOT NULL DEFAULT 'active',
		priority ENUM('low', 'medium', 'high') NOT NULL,
		createdAt VARCHAR(255),
		project_id INT,
		user_id INT,
		FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)`);

	return connection;
}

export default setupDatabase;
