import mysql from 'mysql2/promise';

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Supercombo0*',
    database: 'tasks_db2'
  })

  await connection.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
  )`)

  await connection.query(`CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('active', 'concluded', 'removed') NOT NULL DEFAULT 'active',
    priority ENUM('low', 'medium', 'high') NOT NULL,
    createdAt VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)

  return connection
}

export default setupDatabase