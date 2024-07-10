import Task from "../entity/Task";

export default interface ITaskRepository {
  save(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void>
  findAll(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>
  findAllTasksActive(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>
  findAllTasksConcluded(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>
  findAllTasksRemoved(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>
  findById(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToConcluded(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToActive(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToRemoved(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  delete(id: number, callback: (err: Error | null, isAproved?: boolean) => void): Promise<void>
  updateTaskTitle(id: number, title: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskDescription(id: number, description: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToLow(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToMedium(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  updateTaskToHigh(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>
  findAllTasksLow(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>
  findAllTasksMedium(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>
  findAllTasksHigh(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>
}