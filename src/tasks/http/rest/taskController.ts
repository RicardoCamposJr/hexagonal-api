import { Request, Response, Router } from "express"
import Task from "../../domain/entity/Task"
import TaskRepository from "../../domain/port/TaskRepository"
import RegisterTaskUseCase from "../../domain/usecase/registerTaskUseCase"
import FindAllTasksUseCase from "../../domain/usecase/findAllTasksUseCase"
import FindByTaskIdTasksUseCase from "../../domain/usecase/findByTaskIdUseCase"
import DeleteTaskUseCase from "../../domain/usecase/deleteTaskUseCase"
import UpdateTaskToActiveUseCase from "../../domain/usecase/updateTaskToActiveUseCase"
import UpdateTaskToRemovedUseCase from "../../domain/usecase/updateTaskToRemovedUseCase"
import UpdateTaskToConcludedUseCase from "../../domain/usecase/updateTaskToConcludedUseCase"


export default class TaskController {
  constructor(readonly taskRepository: TaskRepository) {}

  buildRouter(): Router {
    const router = Router()
    router.post("/", this.registerTaskHandler.bind(this))
    router.get("/", this.findAllTasksHandler.bind(this))
    router.get("/:id", this.findByTaskIdHandler.bind(this))
    router.put("/:id/complete", this.updateTaskToConcludedHandler.bind(this))
    router.put("/:id/active", this.updateTaskToActiveHandler.bind(this))
    router.put("/:id/remove", this.updateTaskToRemovedHandler.bind(this))
    router.delete("/:id", this.deleteTaskHandler.bind(this))
    return router
  }

  async registerTaskHandler(req: Request, res: Response) {
    const registerTaskUseCase = new RegisterTaskUseCase(this.taskRepository)

    try {
      const now = new Date()
      const isoDate = now.toISOString()

      const { title, description, priority } = req.body

      if (!title) {
        return res.status(400).send('Insira um título para a task!')
      } else if (!priority) {
        return res.status(400).send('A task deve ter um grau de prioridade!')
      }

      const task = new Task(null, title, description, 'active', priority, isoDate)

      registerTaskUseCase.execute(task, (err, task) => {
        if (err) {
          return res.status(500).send(err.message)
        } else {
          return res.status(201).json(task)
        }
      })
    } catch (error) {
      return res.status(500).send({
        message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: 'Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.'
      })
    }
  }

  async findAllTasksHandler(req: Request, res: Response) {
    const findAllTasksUseCase = new FindAllTasksUseCase(this.taskRepository)

    try {
      findAllTasksUseCase.execute((err, tasks) => {
        if (err) {
          return res.status(500).send(err.message)
        } else {
          return res.status(200).json(tasks)
        }
      })
    } catch (error) {
      return res.status(500).send({
        message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: 'Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.'
      })
    }
  }

  async findByTaskIdHandler(req: Request, res: Response) {
    const findByTaskIdUseCase = new FindByTaskIdTasksUseCase(this.taskRepository)

    try {
      let id

      id = parseInt(req.params.id, 10)

      if (req.params.id) {

        if (isNaN(id) ) {
          return res.status(400).send({
            message: "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: 'Por favor, insira o id de busca do tipo number para realizar a ação.'
          })
        }

        findByTaskIdUseCase.execute(id, (err, task) => {
          if (err) {
            res.status(500).send(err.message)
          } else if (!task) {
            res.status(404).send('Task not found')
          } else {
            res.status(200).json(task)
          }
        })
      } else {
        return res.status(400).send({
          message: "Não foi possível buscar a task. Não encontramos o id de busca!",
          hint: 'Por favor, insira o id de busca para realizar a ação.'
        })
      }
      
    } catch (error) {
      return res.status(500).send({
        message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: 'Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.'
      })
    }
  }

  async updateTaskToConcludedHandler(req: Request, res: Response) {
    const concludeUseCase = new UpdateTaskToConcludedUseCase(this.taskRepository)

    try {
      let id

      id = parseInt(req.params.id, 10)

      if (req.params.id) {

        if (isNaN(id) ) {
          return res.status(400).send({
            message: "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: 'Por favor, insira o id de busca do tipo number para realizar a ação.'
          })
        }

        concludeUseCase.execute(id, (err, task) => {
          if (err) {

            return res.status(500).send(err.message)

          } else if (!task) {

            return res.status(404).json({
              message: "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: 'Por favor, insira um id válido.'
            })
          } else {
            return res.status(200).json(task)
          }
        })
      }
    } catch (error) {
      return res.status(500).send({
        message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: 'Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.'
      })
    }
  }

  async updateTaskToActiveHandler(req: Request, res: Response) {
    const activeUseCase = new UpdateTaskToActiveUseCase(this.taskRepository)

    try {
      let id

      id = parseInt(req.params.id, 10)

      if (req.params.id) {

        if (isNaN(id) ) {
          return res.status(400).send({
            message: "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: 'Por favor, insira o id de busca do tipo number para realizar a ação.'
          })
        }

        activeUseCase.execute(id, (err, task) => {
          if (err) {

            return res.status(500).send(err.message)

          } else if (!task) {

            return res.status(404).json({
              message: "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: 'Por favor, insira um id válido.'
            })
          } else {
            return res.status(200).json(task)
          }
        })
      }
    } catch (error) {
      return res.status(500).send({
        message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: 'Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.'
      })
    }
  }

  async updateTaskToRemovedHandler(req: Request, res: Response) {
    const removedUseCase = new UpdateTaskToRemovedUseCase(this.taskRepository)

    try {
      let id

      id = parseInt(req.params.id, 10)

      if (req.params.id) {

        if (isNaN(id) ) {
          return res.status(400).send({
            message: "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: 'Por favor, insira o id de busca do tipo number para realizar a ação.'
          })
        }

        removedUseCase.execute(id, (err, task) => {
          if (err) {

            return res.status(500).send(err.message)

          } else if (!task) {

            return res.status(404).json({
              message: "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: 'Por favor, insira um id válido.'
            })
          } else {
            return res.status(200).json(task)
          }
        })
      }
    } catch (error) {
      return res.status(500).send({
        message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: 'Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.'
      })
    }
  }

  async deleteTaskHandler(req: Request, res: Response) {
    const deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository)

    try {

      let id

      id = parseInt(req.params.id, 10)

      if (req.params.id) {

        if (isNaN(id) ) {
          return res.status(400).send({
            message: "Não foi possível buscar a task. O id de busca não é do tipo number!",
            hint: 'Por favor, insira o id de busca do tipo number para realizar a ação.'
          })
        }

        deleteTaskUseCase.execute(id, (err, isAproved) => {
          if (err) {
            res.status(500).send(err.message)
          } else if (!isAproved) {

            return res.status(404).json({
              message: "Não foi possível encontrar a task. Não temos uma task com esse id!",
              hint: 'Por favor, insira um id válido.'
            })
            
          } else {
            res.status(204).send('Sua task foi deletada!')
          }
        })
      }
    } catch (error) {
      return res.status(500).send({
        message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
        details: error,
        hint: 'Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.'
      })
    }
  }
}