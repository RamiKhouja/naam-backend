import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    firstname: string;
    lastname?: string;
    email: string;
    password: string;
    role?: UserRole;
    organizationId?: number;
    phone?: string;
    jobtitle?: string;
    image?: string;
    language?: string;
    is_connected?: boolean;
    is_active?: boolean;
}
