import User from "../../entity/User"
import IUserRepository from "../../port/repository/IUserRepository"

export default class RegisterUserUseCase {
  constructor(readonly userRepository: IUserRepository) {}

  async execute(user: User, callback: (err: Error | null, user?: User) => void): Promise<void> {
    await this.userRepository.save(user, callback)
  }
}