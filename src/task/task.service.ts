import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/user/entities/user.entity';
import { Section } from 'src/section/entities/section.entity';
import { Department } from 'src/department/entities/department.entity';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: TreeRepository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { userId, sectionId, departmentId, projectId, parentId, ...taskDto } = createTaskDto;

    const project = await this.projectRepository.findOne({where: {id: projectId}});
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    let section: Section = null;
    if (sectionId) {
      section = await this.sectionRepository.findOne({where: {id: sectionId}});
      if (!section) {
        throw new NotFoundException(`Section with ID ${sectionId} not found`);
      }
    }

    let user: User = null;
    if (userId) {
      user = await this.userRepository.findOne({where: {id: userId}});
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }

    let department: Department = null;
    if (departmentId) {
      department = await this.departmentRepository.findOne({where: {id: departmentId}});
      if (!department) {
        throw new NotFoundException(`Department with ID ${departmentId} not found`);
      }
    }

    let parent: Task = null;
    if (parentId) {
      parent = await this.taskRepository.findOne({where: {id: parentId}});
      if (!parent) {
        throw new NotFoundException(`Parent task with ID ${parentId} not found`);
      }
    }

    const task = this.taskRepository.create({
      ...taskDto,
      user,
      project,
      section,
      department,
      parent
    });
    return this.taskRepository.save(task);
  }


  async findAll(): Promise<Task[]> {
    return this.taskRepository.findTrees({
      relations: ['user', 'section', 'department', 'project']
    });
  }

  async findByUser(userId: number): Promise<Task[]> {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.department', 'department')
      .leftJoinAndSelect('task.section', 'section')
      .leftJoinAndSelect('task.children', 'children')
      .leftJoinAndSelect('task.parent', 'parent')
      .where('task.user_id = :userId', { userId })
      .getMany();
  
    return this.buildTaskTree(tasks);
  }
  
  // Utility method to build the tree structure manually
  private buildTaskTree(tasks: Task[]): Task[] {
    const taskMap: { [key: number]: Task } = {};
  
    // Initialize the map and assign empty children array
    tasks.forEach(task => {
      task.children = [];
      taskMap[task.id] = task;
    });
  
    // Build the tree
    const roots: Task[] = [];
    tasks.forEach(task => {
      if (task.parent) {
        taskMap[task.parent.id].children.push(task);
      } else {
        roots.push(task);
      }
    });
  
    return roots;
  }

  async findByProject(projectId: number): Promise<Task[]> {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.department', 'department')
      .leftJoinAndSelect('task.section', 'section')
      .leftJoinAndSelect('task.children', 'children')
      .leftJoinAndSelect('task.parent', 'parent')
      .where('task.project_id = :projectId', { projectId })
      .getMany();
  
    return this.buildTaskTree(tasks);
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['user', 'section', 'department'] });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { userId, sectionId, departmentId, parentId, ...taskDto } = updateTaskDto;
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['user', 'section', 'department'] });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (userId) {
      const user = await this.userRepository.findOne({where: {id: userId}});
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      task.user = user;
    } else {
      task.user = null;
    }

    if (sectionId) {
      const section = await this.sectionRepository.findOne({where: {id: sectionId}});
      if (!section) {
        throw new NotFoundException(`Section with ID ${sectionId} not found`);
      }
      task.section = section;
    }

    if (departmentId) {
      const department = await this.departmentRepository.findOne({where: {id: departmentId}});
      if (!department) {
        throw new NotFoundException(`Department with ID ${departmentId} not found`);
      }
      task.department = department;
    } else {
      task.department = null;
    }

    if (parentId) {
      const parent = await this.taskRepository.findOne({where: {id: parentId}});
      if (!parent) {
        throw new NotFoundException(`Parent task with ID ${parentId} not found`);
      }
      task.parent = parent;
    }

    Object.assign(task, taskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
