import mysql from 'mysql2/promise';

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Supercombo0*',
    database: 'tasks_db'
  });

  await connection.query(`CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('active', 'concluded', 'removed') NOT NULL DEFAULT 'active'
  )`)

  return connection
}

export default setupDatabase