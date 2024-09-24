export default class User {
  constructor(
    public id: number | null | undefined,
    public username: string,
    public password: string,
    public email: string
  ) {}
}
