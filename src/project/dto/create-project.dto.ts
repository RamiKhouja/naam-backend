import { Priority, Status } from "../entities/project.entity";

export class CreateProjectDto {
    name: string;
    description: string;
    status?: Status;
    priority?: Priority;
    start_date?: string;
    due_date?: string;
    organizationId: number;
}
