import IProjectRepository from "../../port/repository/IProjectRepository";
import Project from "../../entity/Project";

export default class FindProjectByIdUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(userId: number, projectId: number, callback: (err: Error | null, project?: Project | null) => void): Promise<void> {
		await this.projectRepository.findById(userId, projectId, callback);
	}
}
