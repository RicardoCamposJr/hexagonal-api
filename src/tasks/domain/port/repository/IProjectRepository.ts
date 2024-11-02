import type Project from "../../entity/Project";

export default interface IProjectRepository {
	save(project: Project, callback: (err: Error | null, project?: Project) => void): Promise<void>;
	findAll(userId: number, callback: (err: Error | null, projects?: Project[]) => void): Promise<void>;
	findById(userId: number, projectId: number, callback: (err: Error | null, project?: Project | null) => void): Promise<void>;
	updateProjectDetails(
		userId: number,
		projectId: number,
		name: string,
		description: string,
		callback: (err: Error | null, project?: Project | null) => void,
	): Promise<void>;
	delete(userId: number, projectId: number, callback: (err: Error | null, isDeleted?: boolean) => void): Promise<void>;
	addUserToProject(userId: number, projectId: number, newUserId: number, callback: (err: Error | null, isAdded?: boolean) => void): Promise<void>;
	removeUserFromProject(
		userId: number,
		projectId: number,
		removeUserId: number,
		callback: (err: Error | null, isRemoved?: boolean) => void,
	): Promise<void>;
	findAllUsersByProjectId(
		userId: number,
		projectId: number,
		callback: (err: Error | null, users?: Array<{ userId: number; username: string }>) => void,
	): Promise<void>;
	findAllTasksByProjectId(
		userId: number,
		projectId: number,
		callback: (err: Error | null, tasks?: Array<{ taskId: number; title: string; status: string }>) => void,
	): Promise<void>;
}
