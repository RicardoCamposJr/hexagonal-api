import IProjectRepository from "../../port/repository/IProjectRepository";
import Project from "../../entity/Project";

export default class UpdateProjectDetailsUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(
		userId: number,
		projectId: number,
		name: string,
		description: string,
		callback: (err: Error | null, project?: Project | null) => void,
	): Promise<void> {
		await this.projectRepository.updateProjectDetails(userId, projectId, name, description, callback);
	}
}
