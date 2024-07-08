import Task from "../../domain/entity/Task"
import TaskRepository from "../../domain/port/TaskRepository"
import setupDatabase from "./db"

export default class TaskRepositoryDB implements TaskRepository {


  async save(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void> {
    const connection = await setupDatabase()
    const query = `INSERT INTO tasks (title, description, status, priority, createdAt) VALUES (?, ?, ?, ?, ?)`
    const [result] = await connection.execute(query, [task.title, task.description, task.status, task.priority, task.createdAt])
    task.id = (result as any).insertId
    callback(null, task)
  }

  async findAll(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
    const connection = await setupDatabase()
    const query = `SELECT * FROM tasks`
    const [rows] = await connection.execute(query)
    const tasks = (rows as any[]).map(row => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt))
    callback(null, tasks)
  }

  async findById(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    const connection = await setupDatabase()
    const query = `SELECT * FROM tasks WHERE id = ?`
    const [rows] = await connection.execute(query, [id])
    const row = (rows as any[])[0]
    if (!row) return callback(null, null)
    const task = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt)
    callback(null, task)
  }

  async updateTaskToConcluded(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    const connection = await setupDatabase()
    const query = `UPDATE tasks SET status = ? WHERE id = ?`
    await connection.execute(query, ["concluded", id])
    const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id])
    const row = (rows as any[])[0]
    if (!row) return callback(null, null)
    const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt)
    callback(null, taskReturn)
  }

  async updateTaskToActive(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    const connection = await setupDatabase()
    const query = `UPDATE tasks SET status = ? WHERE id = ?`
    await connection.execute(query, ["active", id])
    const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id])
    const row = (rows as any[])[0]
    if (!row) return callback(null, null)
    const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt)
    callback(null, taskReturn)
  }

  async updateTaskToRemoved(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    const connection = await setupDatabase()
    const query = `UPDATE tasks SET status = ? WHERE id = ?`
    await connection.execute(query, ["removed", id])
    const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id])
    const row = (rows as any[])[0]
    if (!row) return callback(null, null)
    const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt)
    callback(null, taskReturn)
  }

  async delete(id: number, callback: (err: Error | null, isAproved?: boolean) => void): Promise<void> {
    const connection = await setupDatabase()
    const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id])
    const row = (rows as any[])[0]
    if (!row) return callback(null, false)
    const query = `DELETE FROM tasks WHERE id = ?`
    await connection.execute(query, [id])
    callback(null, true)
  }
}