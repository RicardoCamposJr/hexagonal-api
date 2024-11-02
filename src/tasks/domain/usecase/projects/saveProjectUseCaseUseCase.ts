import Project from "../../entity/Project";
import IProjectRepository from "../../port/repository/IProjectRepository";

export default class SaveProjectUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(project: Project, callback: (err: Error | null, project?: Project) => void): Promise<void> {
		await this.projectRepository.save(project, callback);
	}
}
