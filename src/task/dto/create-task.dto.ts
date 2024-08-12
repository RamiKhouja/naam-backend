import { TaskStatus, Difficulty } from '../entities/task.entity';
import { Priority } from 'src/project/entities/project.entity';

export class CreateTaskDto {
  name: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  difficulty?: Difficulty;
  userId?: number;
  sectionId?: number;
  projectId: number;
  departmentId?: number;
  start_date?: string;
  due_date?: string;
  parentId?: number;
}
