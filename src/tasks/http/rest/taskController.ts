import { Response, Router } from "express";
import Task from "../../domain/entity/Task";
import RegisterTaskUseCase from "../../domain/usecase/tasks/registerTaskUseCase";
import FindAllTasksUseCase from "../../domain/usecase/tasks/findAllTasksUseCase";
import FindByTaskIdTasksUseCase from "../../domain/usecase/tasks/findByTaskIdUseCase";
import DeleteTaskUseCase from "../../domain/usecase/tasks/deleteTaskUseCase";
import UpdateTaskToActiveUseCase from "../../domain/usecase/tasks/updateTaskToActiveUseCase";
import UpdateTaskToRemovedUseCase from "../../domain/usecase/tasks/updateTaskToRemovedUseCase";
import UpdateTaskToConcludedUseCase from "../../domain/usecase/tasks/updateTaskToConcludedUseCase";
import FindAllTasksActiveUseCase from "../../domain/usecase/tasks/findAllTasksActiveUseCase";
import FindAllTasksConcludedUseCase from "../../domain/usecase/tasks/findAllTasksConcludedUseCase";
import FindAllTasksRemovedUseCase from "../../domain/usecase/tasks/findAllTasksRemovedUseCase";
import UpdateTaskTitleUseCase from "../../domain/usecase/tasks/updateTaskTitleUseCase";
import UpdateTaskDescriptionUseCase from "../../domain/usecase/tasks/updateTaskDescriptionUseCase";
import UpdateTaskToLowUseCase from "../../domain/usecase/tasks/updateTaskToLowUseCase";
import UpdateTaskToMediumUseCase from "../../domain/usecase/tasks/updateTaskToMediumUseCase";
import UpdateTaskToHighUseCase from "../../domain/usecase/tasks/updateTaskToHighUseCase";
import FindAllTasksLowUseCase from "../../domain/usecase/tasks/findAllTasksLowUseCase";
import FindAllTasksMediumUseCase from "../../domain/usecase/tasks/findAllTasksMediumUseCase";
import FindAllTasksHighUseCase from "../../domain/usecase/tasks/findAllTasksHighUseCase";
import FindAllTasksByUserIdUseCase from "../../domain/usecase/tasks/findAllTasksByUserId";
import ITaskRepository from "../../domain/port/repository/ITaskRepository";
import { jwtAuthMiddleware } from "../../adapter/middlewares/jwtAuthMiddleware";
import { IAuthenticatedRequest } from "../../adapter/middlewares/interfaces/IAutenticatedRequest";

export default class TaskController {
  constructor(readonly taskRepository: ITaskRepository) {}

  buildRouter(): Router {
    const router = Router();
    router.post("/", jwtAuthMiddleware, this.registerTaskHandler.bind(this));
    router.get(
      "/",
      jwtAuthMiddleware,
      this.findAllTasksByUserIdHandler.bind(this)
    );
    router.get("/:id", jwtAuthMiddleware, this.findByTaskIdHandler.bind(this));
    router.get(
      "/active",
      jwtAuthMiddleware,
      this.findAllTasksActiveHandler.bind(this)
    );
    router.get(
      "/concluded",
      jwtAuthMiddleware,
      this.findAllTasksConcludedHandler.bind(this)
    );
    router.get(
      "/removed",
      jwtAuthMiddleware,
      this.findAllTasksRemovedHandler.bind(this)
    );
    router.get(
      "/low",
      jwtAuthMiddleware,
      this.findAllTasksLowHandler.bind(this)
    );
    router.get(
      "/medium",
      jwtAuthMiddleware,
      this.findAllTasksMediumHandler.bind(this)
    );
    router.get(
      "/high",
      jwtAuthMiddleware,
      this.findAllTasksHighHandler.bind(this)
    );
    router.patch(
      "/title",
      jwtAuthMiddleware,
      this.updateTaskTitleHandler.bind(this)
    );
    router.patch(
      "/description",
      jwtAuthMiddleware,
      this.updateTaskDescriptionHandler.bind(this)
    );
    router.patch(
      "/:id/conclude",
      jwtAuthMiddleware,
      this.updateTaskToConcludedHandler.bind(this)
    );
    router.patch(
      "/:id/active",
      jwtAuthMiddleware,
      this.updateTaskToActiveHandler.bind(this)
    );
    router.patch(
      "/:id/remove",
      jwtAuthMiddleware,
      this.updateTaskToRemovedHandler.bind(this)
    );
    router.patch(
      "/:id/low",
      jwtAuthMiddleware,
      this.updateTaskToLowHandler.bind(this)
    );
    router.patch(
      "/:id/medium",
      jwtAuthMiddleware,
      this.updateTaskToMediumHandler.bind(this)
    );
    router.patch(
      "/:id/high",
      jwtAuthMiddleware,
      this.updateTaskToHighHandler.bind(this)
    );
    router.delete("/:id", jwtAuthMiddleware, this.deleteTaskHandler.bind(this));

    return router;
  }

  async registerTaskHandler(req: IAuthenticatedRequest, res: Response) {
    const registerTaskUseCase = new RegisterTaskUseCase(this.taskRepository);

    try {
      const userId = req.user?.id;
      const now = new Date();
      const isoDate = now.toISOString();

      const { title, description, priority } = req.body;

      if (!title) {
        return res.status(400).send({
          message:
            "Não foi possível criar a task. O título não foi encontrado!",
          hint: "Por favor, defina um título para a task!",
        });
      } else if (!priority) {
        return res.status(400).send({
          message:
            "Não foi possível criar a task. A prioridade não foi encontrada!",
          hint: "Por favor, defina uma prioridade para a task!",
        });
      } else if (!description) {
        return res.status(400).send({
          message:
            "Não foi possível criar a task. A descrição não foi encontrada!",
          hint: "Por favor, insira uma descrição para a task!",
        });
      } else if (!userId) {
        return res.status(400).send({
          message:
            "Não foi possível criar a task. O id do usuário não foi encontrado!",
          hint: "Por favor, insira um id de usuário válido para a task!",
        });
      }

      const task = new Task(
        null,
        title,
        description,
        "active",
        priority,
        isoDate,
        userId
      );

      registerTaskUseCase.execute(task, (err, task) => {
        if (err) {
          if (err.name == "User not found") {
            return res.status(400).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, insira um id de usuário válido.",
            });
          }

          return res.status(500).send({
            message:
              "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
          });
        } else {
          return res.status(201).json(task);
        }
      });
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findAllTasksHandler(req: IAuthenticatedRequest, res: Response) {
    const findAllTasksUseCase = new FindAllTasksUseCase(this.taskRepository);

    try {
      findAllTasksUseCase.execute((err, tasks) => {
        if (err) {
          return res.status(500).send({
            message:
              "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
          });
        } else {
          return res.status(200).json(tasks);
        }
      });
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findAllTasksByUserIdHandler(req: IAuthenticatedRequest, res: Response) {
    const findAllTasksByUserIdUseCase = new FindAllTasksByUserIdUseCase(
      this.taskRepository
    );

    try {
      findAllTasksByUserIdUseCase.execute(
        Number(req.user?.id),
        (err, tasks) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          }

          if (!tasks || tasks.length === 0) {
            return res.status(404).send({
              message: "Nenhuma tarefa encontrada para o usuário especificado.",
              hint: "Verifique o ID do usuário e tente novamente.",
            });
          }

          return res.status(200).json(tasks);
        }
      );
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findByTaskIdHandler(req: IAuthenticatedRequest, res: Response) {
    const findByTaskIdUseCase = new FindByTaskIdTasksUseCase(
      this.taskRepository
    );

    try {
      let id;

      id = parseInt(req.params.id, 10);

      if (req.params.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        findByTaskIdUseCase.execute(id, req.user?.id as number, (err, task) => {
          if (err) {
            res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            res.status(404).send({
              message: "Não encontramos uma task com o id de busca inserido!",
              hint: "Por favor, revise os dados para realizar a ação.",
            });
          } else {
            res.status(200).json(task);
          }
        });
      } else {
        return res.status(400).send({
          message:
            "Não foi possível buscar a task. Não encontramos o id de busca!",
          hint: "Por favor, insira o id de busca para realizar a ação.",
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async updateTaskToConcludedHandler(
    req: IAuthenticatedRequest,
    res: Response
  ) {
    const concludeUseCase = new UpdateTaskToConcludedUseCase(
      this.taskRepository
    );

    try {
      let id;

      id = parseInt(req.params.id, 10);

      if (req.params.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        concludeUseCase.execute(id, (err, task) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            return res.status(404).json({
              message: "Não encontramos uma task com o id de busca inserido!",
              hint: "Por favor, revise os dados para realizar a ação.",
            });
          } else {
            return res.status(200).json(task);
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async updateTaskToActiveHandler(req: IAuthenticatedRequest, res: Response) {
    const activeUseCase = new UpdateTaskToActiveUseCase(this.taskRepository);

    try {
      let id;

      id = parseInt(req.params.id, 10);

      if (req.params.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        activeUseCase.execute(id, (err, task) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            return res.status(404).json({
              message: "Não encontramos uma task com o id de busca inserido!",
              hint: "Por favor, revise os dados para realizar a ação.",
            });
          } else {
            return res.status(200).json(task);
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async updateTaskToRemovedHandler(req: IAuthenticatedRequest, res: Response) {
    const removedUseCase = new UpdateTaskToRemovedUseCase(this.taskRepository);

    try {
      let id;

      id = parseInt(req.params.id, 10);

      if (req.params.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        removedUseCase.execute(id, (err, task) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            return res.status(404).json({
              message: "Não encontramos uma task com o id de busca inserido!",
              hint: "Por favor, revise os dados para realizar a ação.",
            });
          } else {
            return res.status(200).json(task);
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async deleteTaskHandler(req: IAuthenticatedRequest, res: Response) {
    const deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository);

    try {
      let id;

      id = parseInt(req.params.id, 10);

      if (req.params.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        deleteTaskUseCase.execute(id, (err, isAproved) => {
          if (err) {
            res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!isAproved) {
            return res.status(404).json({
              message: "Não encontramos uma task com o id de busca inserido!",
              hint: "Por favor, revise os dados para realizar a ação.",
            });
          } else {
            res.status(204).send("Sua task foi deletada!");
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findAllTasksActiveHandler(req: IAuthenticatedRequest, res: Response) {
    const findAllTasksActiveUseCase = new FindAllTasksActiveUseCase(
      this.taskRepository
    );

    try {
      findAllTasksActiveUseCase.execute((err, tasks) => {
        if (err) {
          return res.status(500).send({
            message:
              "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
          });
        } else {
          return res.status(200).json(tasks);
        }
      });
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findAllTasksConcludedHandler(
    req: IAuthenticatedRequest,
    res: Response
  ) {
    const findAllTasksConcludedUseCase = new FindAllTasksConcludedUseCase(
      this.taskRepository
    );

    try {
      findAllTasksConcludedUseCase.execute((err, tasks) => {
        if (err) {
          return res.status(500).send({
            message:
              "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
          });
        } else {
          return res.status(200).json(tasks);
        }
      });
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findAllTasksRemovedHandler(req: IAuthenticatedRequest, res: Response) {
    const findAllTasksRemovedUseCase = new FindAllTasksRemovedUseCase(
      this.taskRepository
    );

    try {
      findAllTasksRemovedUseCase.execute((err, tasks) => {
        if (err) {
          return res.status(500).send({
            message:
              "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
          });
        } else {
          return res.status(200).json(tasks);
        }
      });
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async updateTaskTitleHandler(req: IAuthenticatedRequest, res: Response) {
    const updateTaskTitleUseCase = new UpdateTaskTitleUseCase(
      this.taskRepository
    );

    try {
      let id;

      id = parseInt(req.body.id, 10);
      const title = req.body.title;

      if (req.body.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        if (!req.body.title) {
          return res.status(400).send({
            message:
              "Não foi possível atualizar o título da task. O novo título não foi inserido!",
            hint: "Por favor, insira um novo título para realizar a ação.",
          });
        }

        updateTaskTitleUseCase.execute(id, title, (err, task) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            return res.status(404).json({
              message:
                "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: "Por favor, insira um id válido.",
            });
          } else {
            return res.status(200).json(task);
          }
        });
      } else {
        return res.status(400).send({
          message:
            "Não foi possível atualizar o título da task. O id da task não foi inserido!",
          hint: "Por favor, informe o id para realizar a ação.",
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async updateTaskDescriptionHandler(
    req: IAuthenticatedRequest,
    res: Response
  ) {
    const updateTaskDescriptionUseCase = new UpdateTaskDescriptionUseCase(
      this.taskRepository
    );

    try {
      let id;

      id = parseInt(req.body.id, 10);
      const description = req.body.description;

      if (req.body.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        if (!req.body.description) {
          return res.status(400).send({
            message:
              "Não foi possível atualizar a descrição da task. A nova descrição não foi inserida!",
            hint: "Por favor, insira uma nova descrição para realizar a ação.",
          });
        }

        updateTaskDescriptionUseCase.execute(id, description, (err, task) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            return res.status(404).json({
              message:
                "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: "Por favor, insira um id válido.",
            });
          } else {
            return res.status(200).json(task);
          }
        });
      } else {
        return res.status(400).send({
          message:
            "Não foi possível atualizar a descrição da task. O id da task não foi inserido!",
          hint: "Por favor, informe o id para realizar a ação.",
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async updateTaskToLowHandler(req: IAuthenticatedRequest, res: Response) {
    const updateTaskToLowUseCase = new UpdateTaskToLowUseCase(
      this.taskRepository
    );

    try {
      let id;

      id = parseInt(req.params.id, 10);

      if (req.params.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        updateTaskToLowUseCase.execute(id, (err, task) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            return res.status(404).json({
              message:
                "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: "Por favor, insira um id válido.",
            });
          } else {
            return res.status(200).json(task);
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async updateTaskToMediumHandler(req: IAuthenticatedRequest, res: Response) {
    const updateTaskToMediumUseCase = new UpdateTaskToMediumUseCase(
      this.taskRepository
    );

    try {
      let id;

      id = parseInt(req.params.id, 10);

      if (req.params.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        updateTaskToMediumUseCase.execute(id, (err, task) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            return res.status(404).json({
              message:
                "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: "Por favor, insira um id válido.",
            });
          } else {
            return res.status(200).json(task);
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async updateTaskToHighHandler(req: IAuthenticatedRequest, res: Response) {
    const updateTaskToHighUseCase = new UpdateTaskToHighUseCase(
      this.taskRepository
    );

    try {
      let id;

      id = parseInt(req.params.id, 10);

      if (req.params.id) {
        if (isNaN(id)) {
          return res.status(400).send({
            message:
              "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: "Por favor, insira o id de busca do tipo number para realizar a ação.",
          });
        }

        updateTaskToHighUseCase.execute(id, (err, task) => {
          if (err) {
            return res.status(500).send({
              message:
                "Um erro interno ocorreu. Não foi possível realizar essa ação.",
              details: err.message,
              hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
            });
          } else if (!task) {
            return res.status(404).json({
              message:
                "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: "Por favor, insira um id válido.",
            });
          } else {
            return res.status(200).json(task);
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findAllTasksLowHandler(req: IAuthenticatedRequest, res: Response) {
    const findAllTasksLowUseCase = new FindAllTasksLowUseCase(
      this.taskRepository
    );

    try {
      findAllTasksLowUseCase.execute((err, tasks) => {
        if (err) {
          return res.status(500).send({
            message:
              "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
          });
        } else {
          return res.status(200).json(tasks);
        }
      });
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findAllTasksMediumHandler(req: IAuthenticatedRequest, res: Response) {
    const findAllTasksMediumUseCase = new FindAllTasksMediumUseCase(
      this.taskRepository
    );

    try {
      findAllTasksMediumUseCase.execute((err, tasks) => {
        if (err) {
          return res.status(500).send({
            message:
              "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
          });
        } else {
          return res.status(200).json(tasks);
        }
      });
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }

  async findAllTasksHighHandler(req: IAuthenticatedRequest, res: Response) {
    const findAllTasksHighUseCase = new FindAllTasksHighUseCase(
      this.taskRepository
    );

    try {
      findAllTasksHighUseCase.execute((err, tasks) => {
        if (err) {
          return res.status(500).send({
            message:
              "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
          });
        } else {
          return res.status(200).json(tasks);
        }
      });
    } catch (error) {
      return res.status(500).send({
        message:
          "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
      });
    }
  }
}
