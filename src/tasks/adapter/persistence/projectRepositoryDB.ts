import Project from "../../domain/entity/Project";
import IProjectRepository from "../../domain/port/repository/IProjectRepository";
import setupDatabase from "./db";

export default class ProjectRepositoryDB implements IProjectRepository {
	async save(project: Project, callback: (err: Error | null, project?: Project) => void): Promise<void> {
		const connection = await setupDatabase();

		const [rows] = (await connection.execute(`SELECT * FROM users WHERE id = ?`, [project.ownerId])) as any as Array<[]>;

		if (rows.length == 0)
			return callback({
				name: "User not found",
				message: "Usuário não foi encontrado!",
			});

		const query = `INSERT INTO projects (name, description, createdAt, owner_id) VALUES (?, ?, ?, ?)`;

		const [resultProjectCreation] = await connection.execute(query, [project.name, project.description, project.createdAt, project.ownerId]);

		project.id = (resultProjectCreation as any).insertId;

		await connection.execute(`INSERT INTO project_users (project_id, user_id) VALUES (?, ?)`, [project.id, project.ownerId]);

		callback(null, project);
	}

	// Retornar todos os projetos do userId
	async findAll(userId: number, callback: (err: Error | null, projects?: Project[]) => void): Promise<void> {
		const connection = await setupDatabase();

		try {
			// Realiza uma consulta que busca todos os projetos associados ao `userId`
			const [rows] = await connection.execute(
				`
            SELECT p.* 
            FROM projects p
            INNER JOIN project_users pu ON p.id = pu.project_id
            WHERE pu.user_id = ?
        `,
				[userId],
			);

			// Retorna os projetos como um array de objetos `Project`
			const projects = rows as Project[];

			callback(null, projects);
		} catch (error) {
			callback(error as Error);
		} finally {
			await connection.end(); // Certifique-se de fechar a conexão após a consulta
		}
	}

	// Retornar um projeto específico associado ao userId
	async findById(userId: number, projectId: number, callback: (err: Error | null, project?: Project | null) => void): Promise<void> {
		// const connection = await setupDatabase();
		// const query = `SELECT * FROM projects WHERE id = ? AND owner_id = ?`;
		// const [rows] = await connection.execute(query, [projectId, userId]);
		// if ((rows as any[]).length === 0) return callback(null, null);
		// const projectRow = (rows as any[])[0];
		// const project = new Project(projectRow.id, projectRow.name, projectRow.description, projectRow.owner_id);
		// callback(null, project);
	}

	// Atualizar o nome e a descrição de um projeto, validando o userId
	async updateProjectDetails(
		userId: number,
		projectId: number,
		name: string,
		description: string,
		callback: (err: Error | null, project?: Project | null) => void,
	): Promise<void> {
		// const connection = await setupDatabase();
		// const query = `UPDATE projects SET name = ?, description = ? WHERE id = ? AND owner_id = ?`;
		// const [result] = await connection.execute(query, [name, description, projectId, userId]);
		// if ((result as any).affectedRows === 0) return callback(new Error("Projeto não encontrado ou usuário não autorizado"));
		// const updatedProject = new Project(projectId, name, description, userId);
		// callback(null, updatedProject);
	}

	// Excluir um projeto específico associado ao userId
	async delete(userId: number, projectId: number, callback: (err: Error | null, isDeleted?: boolean) => void): Promise<void> {
		const connection = await setupDatabase();
		const query = `DELETE FROM projects WHERE id = ? AND owner_id = ?`;
		const [result] = await connection.execute(query, [projectId, userId]);

		if ((result as any).affectedRows === 0) return callback(new Error("Projeto não encontrado ou usuário não autorizado"));

		callback(null, true);
	}

	// Adicionar um novo usuário a um projeto, validando o userId
	async addUserToProject(
		userId: number,
		projectId: number,
		newUserId: number,
		callback: (err: Error | null, isAdded?: boolean) => void,
	): Promise<void> {
		const connection = await setupDatabase();
		const validationQuery = `SELECT * FROM projects WHERE id = ? AND owner_id = ?`;
		const [rows] = await connection.execute(validationQuery, [projectId, userId]);
		if ((rows as any[]).length === 0) return callback(new Error("Projeto não encontrado ou usuário não autorizado"));

		const addUserQuery = `INSERT INTO project_users (project_id, user_id) VALUES (?, ?)`;
		await connection.execute(addUserQuery, [projectId, newUserId]);

		callback(null, true);
	}

	// Remover um usuário de um projeto, validando o userId
	async removeUserFromProject(
		userId: number,
		projectId: number,
		removeUserId: number,
		callback: (err: Error | null, isRemoved?: boolean) => void,
	): Promise<void> {
		const connection = await setupDatabase();
		const validationQuery = `SELECT * FROM projects WHERE id = ? AND owner_id = ?`;
		const [rows] = await connection.execute(validationQuery, [projectId, userId]);
		if ((rows as any[]).length === 0) return callback(new Error("Projeto não encontrado ou usuário não autorizado"));

		const removeUserQuery = `DELETE FROM project_users WHERE project_id = ? AND user_id = ?`;
		await connection.execute(removeUserQuery, [projectId, removeUserId]);

		callback(null, true);
	}

	// Adicionar uma tarefa ao projeto, validando o userId
	async addTaskToProject(userId: number, projectId: number, taskId: number, callback: (err: Error | null, isAdded?: boolean) => void): Promise<void> {
		const connection = await setupDatabase();
		const validationQuery = `SELECT * FROM projects WHERE id = ? AND owner_id = ?`;
		const [rows] = await connection.execute(validationQuery, [projectId, userId]);
		if ((rows as any[]).length === 0) return callback(new Error("Projeto não encontrado ou usuário não autorizado"));

		const addTaskQuery = `INSERT INTO project_tasks (project_id, task_id) VALUES (?, ?)`;
		await connection.execute(addTaskQuery, [projectId, taskId]);

		callback(null, true);
	}

	// Remover uma tarefa do projeto, validando o userId
	async removeTaskFromProject(
		userId: number,
		projectId: number,
		taskId: number,
		callback: (err: Error | null, isRemoved?: boolean) => void,
	): Promise<void> {
		const connection = await setupDatabase();
		const validationQuery = `SELECT * FROM projects WHERE id = ? AND owner_id = ?`;
		const [rows] = await connection.execute(validationQuery, [projectId, userId]);
		if ((rows as any[]).length === 0) return callback(new Error("Projeto não encontrado ou usuário não autorizado"));

		const removeTaskQuery = `DELETE FROM project_tasks WHERE project_id = ? AND task_id = ?`;
		await connection.execute(removeTaskQuery, [projectId, taskId]);

		callback(null, true);
	}

	// Listar todos os usuários associados a um projeto específico, validando o userId
	async findAllUsersByProjectId(
		userId: number,
		projectId: number,
		callback: (err: Error | null, users?: Array<{ userId: number; username: string }>) => void,
	): Promise<void> {
		const connection = await setupDatabase();
		const validationQuery = `SELECT * FROM projects WHERE id = ? AND owner_id = ?`;
		const [rows] = await connection.execute(validationQuery, [projectId, userId]);
		if ((rows as any[]).length === 0) return callback(new Error("Projeto não encontrado ou usuário não autorizado"));

		const usersQuery = `SELECT users.id as userId, users.username FROM users INNER JOIN project_users ON users.id = project_users.user_id WHERE project_users.project_id = ?`;
		const [userRows] = await connection.execute(usersQuery, [projectId]);
		const users = (userRows as any[]).map((row) => ({ userId: row.userId, username: row.username }));

		callback(null, users);
	}

	// Listar todas as tarefas associadas a um projeto específico, validando o userId
	async findAllTasksByProjectId(
		userId: number,
		projectId: number,
		callback: (err: Error | null, tasks?: Array<{ taskId: number; title: string; status: string }>) => void,
	): Promise<void> {
		const connection = await setupDatabase();
		const validationQuery = `SELECT * FROM projects WHERE id = ? AND owner_id = ?`;
		const [rows] = await connection.execute(validationQuery, [projectId, userId]);
		if ((rows as any[]).length === 0) return callback(new Error("Projeto não encontrado ou usuário não autorizado"));

		const tasksQuery = `SELECT tasks.id as taskId, tasks.title, tasks.status FROM tasks INNER JOIN project_tasks ON tasks.id = project_tasks.task_id WHERE project_tasks.project_id = ?`;
		const [taskRows] = await connection.execute(tasksQuery, [projectId]);
		const tasks = (taskRows as any[]).map((row) => ({ taskId: row.taskId, title: row.title, status: row.status }));

		callback(null, tasks);
	}
}
