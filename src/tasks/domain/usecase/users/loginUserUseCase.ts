import User from "../../entity/User";
import IUserRepository from "../../port/repository/IUserRepository";

export default class LoginUserUseCase {
	constructor(readonly userRepository: IUserRepository) {}

	async execute(email: string, callback: (err: Error | null, user?: User) => void): Promise<void> {
		await this.userRepository.getPassword(email, callback);
	}
}
