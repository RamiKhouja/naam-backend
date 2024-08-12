import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const {organizationId, ...projectDto} = createProjectDto;
    const organization = await this.orgRepository.findOne({where: {id: organizationId}});
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    const project = this.projectRepository.create({
      ...projectDto,
      organization
    });
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({relations: ['sections', 'sections.tasks', 'tasks']});
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.sections', 'section')
      .leftJoinAndSelect('section.tasks', 'task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.department', 'department')
      .leftJoinAndSelect('project.tasks', 'taskNoSection', 'taskNoSection.section_id IS NULL')
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByOrg(id: number): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { organization: { id } },
      relations: ['sections', 'sections.tasks', 'tasks'], // Include sections relation
    });
    if (!projects) {
        throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return projects;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.projectRepository.update(id, updateProjectDto);
    const updatedProject = await this.findOne(id);
    return updatedProject;
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
}
