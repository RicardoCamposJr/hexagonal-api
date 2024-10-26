import type Project from "../../entity/Project";

export default interface IProjectRepository {
	// Salva um novo projeto associado ao userId
	save(userId: number, project: Project, callback: (err: Error | null, project?: Project) => void): Promise<void>;

	// Retorna todos os projetos do userId
	findAll(userId: number, callback: (err: Error | null, projects?: Project[]) => void): Promise<void>;

	// Retorna um projeto específico associado ao userId
	findById(userId: number, projectId: number, callback: (err: Error | null, project?: Project | null) => void): Promise<void>;

	// Atualiza o nome e a descrição de um projeto, validando o userId
	updateProjectDetails(
		userId: number,
		projectId: number,
		name: string,
		description: string,
		callback: (err: Error | null, project?: Project | null) => void,
	): Promise<void>;

	// Exclui um projeto específico associado ao userId
	delete(userId: number, projectId: number, callback: (err: Error | null, isDeleted?: boolean) => void): Promise<void>;

	// Adiciona um novo usuário a um projeto, validando o userId que está fazendo a operação
	addUserToProject(userId: number, projectId: number, newUserId: number, callback: (err: Error | null, isAdded?: boolean) => void): Promise<void>;

	// Remove um usuário de um projeto, validando o userId que está fazendo a operação
	removeUserFromProject(
		userId: number,
		projectId: number,
		removeUserId: number,
		callback: (err: Error | null, isRemoved?: boolean) => void,
	): Promise<void>;

	// Adiciona uma tarefa ao projeto, validando o userId
	addTaskToProject(userId: number, projectId: number, taskId: number, callback: (err: Error | null, isAdded?: boolean) => void): Promise<void>;

	// Remove uma tarefa do projeto, validando o userId
	removeTaskFromProject(userId: number, projectId: number, taskId: number, callback: (err: Error | null, isRemoved?: boolean) => void): Promise<void>;

	// Retorna todos os usuários associados a um projeto específico, validando o userId
	findAllUsersByProjectId(
		userId: number,
		projectId: number,
		callback: (err: Error | null, users?: Array<{ userId: number; username: string }>) => void,
	): Promise<void>;

	// Retorna todas as tarefas associadas a um projeto específico, validando o userId
	findAllTasksByProjectId(
		userId: number,
		projectId: number,
		callback: (err: Error | null, tasks?: Array<{ taskId: number; title: string; status: string }>) => void,
	): Promise<void>;
}
