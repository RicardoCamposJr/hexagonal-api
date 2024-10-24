import type Task from "../../entity/Task";

export default interface ITaskRepository {
	save(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void>;
	findAll(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>;
	findAllTasksActive(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>;
	findAllTasksConcluded(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>;
	findAllTasksRemoved(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>;
	findById(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>;
	updateTaskToConcluded(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>;
	updateTaskToActive(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>;
	updateTaskToRemoved(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>;
	delete(taskId: number, userId: number, callback: (err: Error | null, isAproved?: boolean) => void): Promise<void>;
	updateTaskTitle(taskId: number, userId: number, title: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void>;
	updateTaskDescription(
		taskId: number,
		userId: number,
		description: string,
		callback: (err: Error | null, task?: Task | null) => void,
	): Promise<void>;
	updateTaskToLow(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>;
	updateTaskToMedium(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>;
	updateTaskToHigh(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void>;
	findAllTasksLow(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>;
	findAllTasksMedium(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>;
	findAllTasksHigh(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void>;
	findAllTasksByUserId(userId: number, callback: (err: Error | null, tasks?: Task[] | null) => void): Promise<void>;
}
