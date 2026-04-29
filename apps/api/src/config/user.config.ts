import { registerAs } from '@nestjs/config';
import {UserFixture} from "../user/user.type";

/**
 * Note: hardcoded values were suggested in task description.
 * Obviously, production-ready code would never have this kind of config.
 */
export default registerAs('users', (): UserFixture[] => [
    {email: 'admin@mcp.chat', password: 'admin'},
]);
