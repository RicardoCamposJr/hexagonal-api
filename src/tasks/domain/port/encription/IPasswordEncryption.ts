// Essa porta é implementada pelo adapter PasswordEncryption. O intuito dela é de isolar a encriptação
// das senhas do sistema, fora do domínio da aplicação.
export interface IPasswordEncryption {
  encrypt: (password: string) => Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
