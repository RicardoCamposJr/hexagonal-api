import { Request, Response, Router } from "express"
import UserRepositoryDB from "../../adapter/persistence/userRepositoryDB"
import User from "../../domain/entity/User"
import RegisterUserUseCase from "../../domain/usecase/users/registerUserUseCase"



export default class UserController {
  constructor(readonly userRepository: UserRepositoryDB) {}

  buildRouter(): Router {
    const router = Router()
    router.post("/", this.registerUserHandler.bind(this))

    return router
  }

  async registerUserHandler(req: Request, res: Response) {
    const registerUserUseCase = new RegisterUserUseCase(this.userRepository)

    try {

      const { username, password, email } = req.body

      if (!username) {

        return res.status(400).send({
          message: "Não foi possível criar o usuário. O username não foi encontrado!",
          hint: 'Por favor, defina um username para o usuário!'
        })
      } else if (!password) {

        return res.status(400).send({
          message: "Não foi possível criar o usuário. A senha não foi encontrada!",
          hint: 'Por favor, defina uma senha para o usuário!'
        })
      } else if (!email) {

        return res.status(400).send({
          message: "Não foi possível criar o usuário. O email não foi encontrado!",
          hint: 'Por favor, insira um email para o usuário!'
        })
      }

      const user = new User(null, username, password, email)

      registerUserUseCase.execute(user, (err, user) => {
        if (err) {

          return res.status(500).send({
            message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
            details: err.message,
            hint: 'Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.'
          })

        } else {
          return res.status(201).json(user)
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
  
}