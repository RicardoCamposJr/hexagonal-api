import IProjectRepository from "../../port/repository/IProjectRepository";
import Project from "../../entity/Project";

export default class FindAllProjectsUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(userId: number, callback: (err: Error | null, projects?: Project[]) => void): Promise<void> {
		await this.projectRepository.findAll(userId, callback);
	}
}
