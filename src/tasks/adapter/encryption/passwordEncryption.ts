import { compare, hash } from "bcrypt";
import { IPasswordEncryption } from "../../domain/port/encription/IPasswordEncryption";

export class PasswordEncryption implements IPasswordEncryption {
	async encrypt(password: string): Promise<string> {
		const saltRounds = 10;
		return await hash(password, saltRounds);
	}

	async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
		return await compare(plainPassword, hashedPassword);
	}
}
