// Este Adapter se refere à implemetação da interface IAuthToken,
// que é a Porta que as regras de negócio do sistema requer para tokens de acesso.
import jwt from "jsonwebtoken";
import { IAuthToken } from "../../domain/port/authToken/IAuthToken";
import { configDotenv } from "dotenv";

configDotenv({ path: "./.env" });

export class JwtAuthTokenService implements IAuthToken {
  generateToken(payload: any): string {
    return jwt.sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: 3600,
    });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.SECRET_KEY as string);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
