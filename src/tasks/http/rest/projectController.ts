import { Request, Response, Router } from "express";
import ProjectRepositoryDB from "../../adapter/persistence/projectRepositoryDB";
import SaveProjectUseCase from "../../domain/usecase/projects/saveProjectUseCaseUseCase";
import Project from "../../domain/entity/Project";
import { IAuthenticatedRequest } from "../../adapter/middlewares/interfaces/IAutenticatedRequest";
import { jwtAuthMiddleware } from "../../adapter/middlewares/jwtAuthMiddleware";

export default class ProjectController {
	constructor(readonly projectRepository: ProjectRepositoryDB) {}

	buildRouter(): Router {
		const router = Router();
		router.post("/", jwtAuthMiddleware, this.registerProjectHandler.bind(this));

		return router;
	}

	async registerProjectHandler(req: IAuthenticatedRequest, res: Response) {
		const registerProjectUseCase = new SaveProjectUseCase(this.projectRepository);

		try {
			const { name, description, email } = req.body;
			const now = new Date();
			const isoDate = now.toISOString();

			if (!name) {
				return res.status(400).send({
					message: "Não foi possível criar o projeto. O nome do projeto não foi inserido!",
					hint: "Por favor, defina um nome para o projeto!",
				});
			} else if (!description) {
				return res.status(400).send({
					message: "Não foi possível criar o projeto. A descrição do projeto não foi inserida!",
					hint: "Por favor, defina uma descrição para o usuário!",
				});
			}

			const project = new Project(null, req.user?.id as number, name, description, isoDate);

			registerProjectUseCase.execute(project, (err, project) => {
				if (err) {
					if (err.name == "User not found") {
						return res.status(409).send({
							message: "Não foi possível criar o projeto. O usuário não foi encontrado!",
							details: err.message,
							hint: "Por favor, insira um usuário válido.",
						});
					}

					return res.status(500).send({
						message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
						details: err.message,
						hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
					});
				} else {
					return res.status(201).json(project);
				}
			});
		} catch (error) {
			return res.status(500).send({
				message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
				details: error,
				hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
			});
		}
	}
}
