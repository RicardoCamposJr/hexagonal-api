// Essa Porta é uma exigência da regra de negócios do sistema, para Adapters que
// implementam funções para tokens de acesso.
export interface IAuthToken {
  generateToken(payload: any): string;
  verifyToken(token: string): any;
}