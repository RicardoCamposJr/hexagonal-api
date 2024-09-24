import { Request } from "express";

// Essa interface se refere à informação que vai ser armazenada no objeto "req" das funções
// acionadas nos Controllers. Nesse caso, o parâmetro "req" dos Controllers dessa aplicação possuem esse tipo.
// Podendo capturar a informação por {req.user.id}, por exemplo.

export interface IAuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}
