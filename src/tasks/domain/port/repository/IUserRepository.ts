import User from "../../entity/User";

export default interface IUserRepository {
  save(
    user: User,
    callback: (err: Error | null, user?: User) => void
  ): Promise<void>;
  findAll(callback: (err: Error | null, users?: User[]) => void): Promise<void>;
  findById(
    id: number,
    callback: (err: Error | null, user?: User | null) => void
  ): Promise<void>;
  updateUser(
    user: User,
    callback: (err: Error | null, user?: User | null) => void
  ): Promise<void>;
  delete(
    id: number,
    callback: (err: Error | null, isApproved?: boolean) => void
  ): Promise<void>;
  getPassword(
    email: string,
    callback: (err: Error | null, user?: User) => void
  ): Promise<void>;
}
