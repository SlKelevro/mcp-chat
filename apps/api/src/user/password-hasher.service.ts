import * as bcrypt from 'bcryptjs';
import {Injectable} from "@nestjs/common";

@Injectable()
export class PasswordHasherService {
    public async hash(password: string): Promise<string> {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }

    public async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}