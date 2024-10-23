import { Request, Response, Router } from "express";
import UserRepositoryDB from "../../adapter/persistence/userRepositoryDB";
import User from "../../domain/entity/User";
import RegisterUserUseCase from "../../domain/usecase/users/registerUserUseCase";
import { PasswordEncryption } from "../../adapter/encryption/passwordEncryption";
import { JwtAuthTokenService } from "../../adapter/jwt/JwtAuthService";
import LoginUserUseCase from "../../domain/usecase/users/loginUserUseCase";

export default class UserController {
	constructor(
		readonly userRepository: UserRepositoryDB,
		readonly passwordEncryptor: PasswordEncryption,
		readonly jwtTokenService: JwtAuthTokenService,
	) {}

	buildRouter(): Router {
		const router = Router();
		router.post("/", this.registerUserHandler.bind(this));
		router.post("/login", this.loginUserHandler.bind(this));

		return router;
	}

	async registerUserHandler(req: Request, res: Response) {
		const registerUserUseCase = new RegisterUserUseCase(this.userRepository);

		try {
			const { username, password, email } = req.body;

			if (!username) {
				return res.status(400).send({
					message: "Não foi possível criar o usuário. O username não foi encontrado!",
					hint: "Por favor, defina um username para o usuário!",
				});
			} else if (!password) {
				return res.status(400).send({
					message: "Não foi possível criar o usuário. A senha não foi encontrada!",
					hint: "Por favor, defina uma senha para o usuário!",
				});
			} else if (!email) {
				return res.status(400).send({
					message: "Não foi possível criar o usuário. O email não foi encontrado!",
					hint: "Por favor, insira um email para o usuário!",
				});
			}

			// Encriptando a senha:
			const hashedPassword = await this.passwordEncryptor.encrypt(password);

			const user = new User(null, username, hashedPassword, email);

			registerUserUseCase.execute(user, (err, user) => {
				if (err) {
					if (err.name == "Already in use") {
						return res.status(409).send({
							message: "Não foi possível criar o usuário. O email já está em uso!",
							details: err.message,
							hint: "Por favor, insira um novo email.",
						});
					}

					return res.status(500).send({
						message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
						details: err.message,
						hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
					});
				} else {
					return res.status(201).json(user);
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

	async loginUserHandler(req: Request, res: Response) {
		const loginUserUseCase = new LoginUserUseCase(this.userRepository);

		try {
			const { password, email } = req.body;

			if (!password) {
				return res.status(400).send({
					message: "Não foi possível efetuar o login. A senha não foi inserida!",
					hint: "Por favor, insira uma senha.",
				});
			} else if (!email) {
				return res.status(400).send({
					message: "Não foi possível efetuar o login. O email não foi inserido!",
					hint: "Por favor, insira um email.",
				});
			}

			// Buscando do banco de dados se existe um usuário com este email:
			loginUserUseCase.execute(email, (err, user) => {
				if (err?.name == "User not found") {
					return res.status(400).send({
						message: "Não foi possível efetuar o login. Este email não existe no sistema!",
						details: err.message,
						hint: "Por favor, insira um email válido.",
					});
				}

				// Caso exista, comparando o hash no banco de dados com a senha informada no login:
				this.passwordEncryptor
					.compare(password, user?.password as string)
					.then((isCorrect) => {
						if (isCorrect) {
							// Gerando token de acesso e retornando-o:
							const token = this.jwtTokenService.generateToken({
								userId: user?.id,
							});
							return res.json({ auth: true, access_token: token });
						} else {
							return res.status(400).send({
								message: "Não foi possível efetuar o login. Senha incorreta.",
								details: "Senha incorreta.",
								hint: "Por favor, insira uma senha válida.",
							});
						}
					})
					.catch((err) => {
						return res.status(400).send({
							message: "Um erro interno ocorreu. Não foi possível realizar essa ação.",
							details: err,
							hint: "Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.",
						});
					});
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
