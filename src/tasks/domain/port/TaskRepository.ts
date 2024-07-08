import Task from "../entity/Task";

export default interface TaskRepository {
  save(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void>
  findAll(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>
  findById(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToConcluded(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToActive(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToRemoved(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  delete(id: number, callback: (err: Error | null, isAproved?: boolean) => void): Promise<void>
}