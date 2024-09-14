// infrastructure/repository/UserRepositoryDB.ts
import User from "../../domain/entity/User";
import IUserRepository from "../../domain/port/IUserRepository";
import setupDatabase from "./db";

export default class UserRepositoryDB implements IUserRepository {

  async save(user: User, callback: (err: Error | null, user?: User) => void): Promise<void> {
    const connection = await setupDatabase();
    
    const verify = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await connection.execute(verify, [user.email]) as any // Retorna um array de objetos com os registros;
    
    const isEmailAlreadyInUse = rows.some((register: any) => register.email == user.email)
    
    if (isEmailAlreadyInUse) return callback({message: 'O email já está em uso', name: 'Already in use'}, undefined)
    
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    const [result] = await connection.execute(query, [user.username, user.password, user.email]);
    user.id = (result as any).insertId;
    callback(null, user);
  }

  async findAll(callback: (err: Error | null, users?: User[]) => void): Promise<void> {
    const connection = await setupDatabase();
    const query = `SELECT * FROM users`;
    const [rows] = await connection.execute(query);
    const users = (rows as any[]).map(row => new User(row.id, row.username, row.password, row.email));
    callback(null, users);
  }

  async findById(id: number, callback: (err: Error | null, user?: User | null) => void): Promise<void> {
    const connection = await setupDatabase();
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.execute(query, [id]);
    const row = (rows as any[])[0];
    if (!row) return callback(null, null);
    const user = new User(row.id, row.username, row.password, row.email);
    callback(null, user);
  }

  async updateUser(user: User, callback: (err: Error | null, user?: User | null) => void): Promise<void> {
    const connection = await setupDatabase();
    const query = `UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?`;
    await connection.execute(query, [user.username, user.password, user.email, user.id]);
    const [rows] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [user.id]);
    const row = (rows as any[])[0];
    if (!row) return callback(null, null);
    const updatedUser = new User(row.id, row.username, row.password, row.email);
    callback(null, updatedUser);
  }

  async delete(id: number, callback: (err: Error | null, isApproved?: boolean) => void): Promise<void> {
    const connection = await setupDatabase();
    const [rows] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [id]);
    const row = (rows as any[])[0];
    if (!row) return callback(null, false);
    const query = `DELETE FROM users WHERE id = ?`;
    await connection.execute(query, [id]);
    callback(null, true);
  }
}
