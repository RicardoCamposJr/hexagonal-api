import { NextFunction, Response } from "express";
import { JwtAuthTokenService } from "../jwt/JwtAuthService";
import { IAuthenticatedRequest } from "./interfaces/IAutenticatedRequest";

// Esse middleware é responável por verificar se o access token do usuário está presente,
// válido ou inválido. Assim, ele é posto nas rotas para haver essa validação antes da rota ser
// acessada.

export const jwtAuthMiddleware = (
  req: IAuthenticatedRequest,
  res: Response,
  // O parâmetro "next" é do express, indicando o seguimento do funcionamento da rota.
  next: NextFunction
) => {
  const jwtTokenService = new JwtAuthTokenService();
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não encontrado!" });
  }

  try {
    const user = jwtTokenService.verifyToken(token);
    req.user = { id: user.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido ou expirado!" });
  }
};
