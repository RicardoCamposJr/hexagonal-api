import Project from "../../entity/Project";
import IProjectRepository from "../../port/repository/IProjectRepository";

export default class SaveProjectUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(userId: number, project: Project, callback: (err: Error | null, project?: Project) => void): Promise<void> {
		await this.projectRepository.save(userId, project, callback);
	}
}
