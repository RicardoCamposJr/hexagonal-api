import { Response, Router } from "express";
import ProjectRepositoryDB from "../../adapter/persistence/projectRepositoryDB";
import SaveProjectUseCase from "../../domain/usecase/projects/saveProjectUseCaseUseCase";
import Project from "../../domain/entity/Project";
import { IAuthenticatedRequest } from "../../adapter/middlewares/interfaces/IAutenticatedRequest";
import { jwtAuthMiddleware } from "../../adapter/middlewares/jwtAuthMiddleware";
import FindAllProjectsUseCase from "../../domain/usecase/projects/findAllProjectsUseCase";
import FindProjectByIdUseCase from "../../domain/usecase/projects/findProjectByIdUseCase";

export default class ProjectController {
	constructor(readonly projectRepository: ProjectRepositoryDB) {}

	buildRouter(): Router {
		const router = Router();
		router.post("/", jwtAuthMiddleware, this.registerProjectHandler.bind(this));
		router.get("/", jwtAuthMiddleware, this.findAllProjectsHandler.bind(this));
		router.get("/:id", jwtAuthMiddleware, this.findProjectByIdHandler.bind(this));

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

	async findAllProjectsHandler(req: IAuthenticatedRequest, res: Response) {
		const findAllProjectsUseCase = new FindAllProjectsUseCase(this.projectRepository);

		try {
			findAllProjectsUseCase.execute(req.user?.id as number, (err, projects) => {
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
					return res.status(201).json(projects);
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

	async findProjectByIdHandler(req: IAuthenticatedRequest, res: Response) {
		const findProjectByIdUseCase = new FindProjectByIdUseCase(this.projectRepository);

		try {
			let id;

			id = parseInt(req.params.id, 10);

			if (req.params.id) {
				if (isNaN(id)) {
					return res.status(400).send({
						message: "Não foi possível buscar pelo projeto. O id de busca não é do tipo number!",
						hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
					});
				}

				findProjectByIdUseCase.execute(req.user?.id as number, id, (err, project) => {
					if (!project) {
						return res.status(500).send({
							message: "Não encontramos um projeto com o id informado. Não foi possível realizar essa ação.",
							hint: "Por favor, insira um id existente.",
						});
					} else {
						return res.status(201).json(project);
					}
				});
			} else {
				return res.status(400).send({
					message: "Não foi possível buscar a task. Não encontramos o id de busca!",
					hint: "Por favor, insira o id de busca para realizar a ação.",
				});
			}
		} catch (error) {
			return res.status(500).send({
				message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
				details: error,
				hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
			});
		}
	}
}
