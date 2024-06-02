import Task from "../../domain/entity/Task"
import TaskRepository from "../../domain/port/TaskRepository"

export default class TaskRepositoryArray implements TaskRepository {

  private taskArray : Task[] | null = []

  async save(task: Task, callback: (err: Error | null, tasks?: Task) => void): Promise<void> {
    await this.taskArray?.push(task)
    console.log(this.taskArray)
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