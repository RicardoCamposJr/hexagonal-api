import Task from "../../domain/entity/Task"
import TaskRepository from "../../domain/port/ITaskRepository"

export default class TaskRepositoryArray implements TaskRepository {

  private taskArray : Task[] | null = []
  private id: number = 0

  async save(task: Task, callback: (err: Error | null, tasks?: Task) => void): Promise<void> {
    task.id = this.id
    this.id += 1
    await this.taskArray?.push(task)
    callback(null, task)
  }

  async findAll(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
    
  }

  async findById(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    
  }

  async update(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void> {
    
  }

  async delete(id: number, callback: (err: Error | null) => void): Promise<void> {
    
  }
}