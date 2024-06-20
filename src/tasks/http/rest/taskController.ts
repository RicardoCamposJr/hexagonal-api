import { Request, Response, Router } from "express"
import Task from "../../domain/entity/Task"
import TaskRepository from "../../domain/port/TaskRepository"
import RegisterTaskUseCase from "../../domain/usecase/registerTaskUseCase"
import FindAllTasksUseCase from "../../domain/usecase/findAllTasksUseCase"
import FindByTaskIdTasksUseCase from "../../domain/usecase/findByTaskIdUseCase"
import UpdateTaskUseCase from "../../domain/usecase/updateTaskUseCase"
import DeleteTaskUseCase from "../../domain/usecase/deleteTaskUseCase"

export default class TaskController {
  constructor(readonly taskRepository: TaskRepository) {}

  buildRouter(): Router {
    const router = Router()
    router.post("/", this.registerTaskHandler.bind(this))
    router.get("/", this.findAllTasksHandler.bind(this))
    router.get("/:id", this.findByTaskIdHandler.bind(this))
    router.put("/:id", this.updateTaskHandler.bind(this))
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
      return res.status(500).send(error)
    }
  }

  async findAllTasksHandler(req: Request, res: Response) {
    // const findAllTasksUseCase = new FindAllTasksUseCase(this.taskRepository)

    // findAllTasksUseCase.execute((err, tasks) => {
    //   if (err) {
    //     res.status(500).send(err.message)
    //   } else {
    //     res.status(200).json(tasks)
    //   }
    // })
  }

  async findByTaskIdHandler(req: Request, res: Response) {
    // const findByTaskIdUseCase = new FindByTaskIdTasksUseCase(this.taskRepository)

    // const id = parseInt(req.params.id, 10)

    // findByTaskIdUseCase.execute(id, (err, task) => {
    //   if (err) {
    //     res.status(500).send(err.message)
    //   } else if (!task) {
    //     res.status(404).send('Task not found')
    //   } else {
    //     res.status(200).json(task)
    //   }
    // })
  }

  async updateTaskHandler(req: Request, res: Response) {
    // const updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository)

    // const id = parseInt(req.params.id, 10)
    // const { title, description, status, priority } = req.body
    // const task = new Task(id, title, description, status, )

    // updateTaskUseCase.execute(task, (err, task) => {
    //   if (err) {
    //     res.status(500).send(err.message)
    //   } else {
    //     res.status(200).json(task)
    //   }
    // })
  }

  async deleteTaskHandler(req: Request, res: Response) {
  //   const deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository)

  //   const id = parseInt(req.params.id, 10)
  //   deleteTaskUseCase.execute(id, (err) => {
  //     if (err) {
  //       res.status(500).send(err.message)
  //     } else {
  //       res.status(204).send()
  //     }
  //   })
  }
}