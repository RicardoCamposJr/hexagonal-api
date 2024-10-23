import Task from "../../domain/entity/Task";
import ITaskRepository from "../../domain/port/repository/ITaskRepository";
import setupDatabase from "./db";

export default class TaskRepositoryDB implements ITaskRepository {
	async save(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void> {
		const connection = await setupDatabase();

		const validationUserIdQuery = `SELECT * FROM users WHERE id = ?`;
		const [rows] = (await connection.execute(validationUserIdQuery, [task.userId])) as any as Array<[]>; // Retorna um array de objetos com registros.
		if (rows.length == 0)
			return callback({
				name: "User not found",
				message: "Usuário não foi encontrado!",
			});

		const query = `INSERT INTO tasks (title, description, status, priority, createdAt, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
		const [result] = await connection.execute(query, [task.title, task.description, task.status, task.priority, task.createdAt, task.userId]);
		task.id = (result as any).insertId;

		callback(null, task);
	}

	async findAll(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `SELECT * FROM tasks`;
		const [rows] = await connection.execute(query);
		const tasks = (rows as any[]).map((row) => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId));
		callback(null, tasks);
	}

	async findAllTasksByUserId(userId: number, callback: (err: Error | null, tasks?: Task[] | null) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `SELECT * FROM tasks WHERE user_id = ?`;
		const [rows] = await connection.execute(query, [userId]);

		if (!rows || (rows as any[]).length === 0) {
			return callback(null, null);
		}

		// Mapeia cada linha retornada para uma instância de Task
		const tasks = (rows as any[]).map((row) => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId));

		callback(null, tasks);
	}

	async findById(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `SELECT * FROM tasks WHERE id = ? AND user_id = ?`;
		const [rows] = await connection.execute(query, [taskId, userId]);
		const row = (rows as any[])[0];
		if (!row) return callback(null, null);
		const task = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId);
		callback(null, task);
	}

	async updateTaskToConcluded(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();

		await connection.execute(`UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?`, ["concluded", taskId, userId]);

		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [taskId, userId]);

		const row = (rows as any[])[0];

		if (!row) return callback(null, null);

		const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.user_id);

		callback(null, taskReturn);
	}

	async updateTaskToActive(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();

		await connection.execute(`UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?`, ["active", taskId, userId]);

		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [taskId, userId]);

		const row = (rows as any[])[0];

		if (!row) return callback(null, null);

		const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.user_id);

		callback(null, taskReturn);
	}

	async updateTaskToRemoved(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();

		await connection.execute(`UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?`, ["removed", taskId, userId]);

		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [taskId, userId]);

		const row = (rows as any[])[0];

		if (!row) return callback(null, null);

		const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.user_id);

		callback(null, taskReturn);
	}

	async delete(taskId: number, userId: number, callback: (err: Error | null, isAproved?: boolean) => void): Promise<void> {
		const connection = await setupDatabase();

		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [taskId, userId]);

		const row = (rows as any[])[0];

		if (!row) return callback(null, false);

		await connection.execute(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [taskId, userId]);

		callback(null, true);
	}

	async findAllTasksActive(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
		const connection = await setupDatabase();

		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE status = "active" AND user_id = ?`, [userId]);

		if (!(rows as any)[0])
			return callback({
				name: "Tasks not found",
				message: "Nenhuma task ativa foi encontrada para esse usuário.",
			});

		const tasks = (rows as any[]).map((row) => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.user_id));

		callback(null, tasks);
	}

	async findAllTasksConcluded(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
		const connection = await setupDatabase();

		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE status = "concluded" AND user_id = ?`, [userId]);

		if (!(rows as any)[0])
			return callback({
				name: "Tasks not found",
				message: "Nenhuma task concluída foi encontrada para esse usuário.",
			});

		const tasks = (rows as any[]).map((row) => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.user_id));

		callback(null, tasks);
	}

	async findAllTasksRemoved(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
		const connection = await setupDatabase();

		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE status = "removed" AND user_id = ?`, [userId]);

		if (!(rows as any)[0])
			return callback({
				name: "Tasks not found",
				message: "Nenhuma task removida foi encontrada para esse usuário.",
			});

		const tasks = (rows as any[]).map((row) => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.user_id));

		callback(null, tasks);
	}

	async updateTaskTitle(id: number, title: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `UPDATE tasks SET title = ? WHERE id = ?`;
		await connection.execute(query, [title, id]);
		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
		const row = (rows as any[])[0];
		if (!row) return callback(null, null);
		const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId);
		callback(null, taskReturn);
	}

	async updateTaskDescription(id: number, description: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `UPDATE tasks SET description = ? WHERE id = ?`;
		await connection.execute(query, [description, id]);
		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
		const row = (rows as any[])[0];
		if (!row) return callback(null, null);
		const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId);
		callback(null, taskReturn);
	}

	async updateTaskToLow(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `UPDATE tasks SET priority = ? WHERE id = ?`;
		await connection.execute(query, ["low", id]);
		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
		const row = (rows as any[])[0];
		if (!row) return callback(null, null);
		const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId);
		callback(null, taskReturn);
	}

	async updateTaskToMedium(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `UPDATE tasks SET priority = ? WHERE id = ?`;
		await connection.execute(query, ["medium", id]);
		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
		const row = (rows as any[])[0];
		if (!row) return callback(null, null);
		const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId);
		callback(null, taskReturn);
	}

	async updateTaskToHigh(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `UPDATE tasks SET priority = ? WHERE id = ?`;
		await connection.execute(query, ["high", id]);
		const [rows] = await connection.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
		const row = (rows as any[])[0];
		if (!row) return callback(null, null);
		const taskReturn = new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId);
		callback(null, taskReturn);
	}

	async findAllTasksLow(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `SELECT * FROM tasks WHERE priority = "low"`;
		const [rows] = await connection.execute(query);
		const tasks = (rows as any[]).map((row) => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId));
		callback(null, tasks);
	}

	async findAllTasksMedium(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `SELECT * FROM tasks WHERE priority = "medium"`;
		const [rows] = await connection.execute(query);
		const tasks = (rows as any[]).map((row) => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId));
		callback(null, tasks);
	}

	async findAllTasksHigh(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `SELECT * FROM tasks WHERE priority = "high"`;
		const [rows] = await connection.execute(query);
		const tasks = (rows as any[]).map((row) => new Task(row.id, row.title, row.description, row.status, row.priority, row.createdAt, row.userId));
		callback(null, tasks);
	}
}
