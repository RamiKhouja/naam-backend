import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Project } from 'src/project/entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectionService {

  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const { projectId, ...sectionDto } = createSectionDto;
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const section = this.sectionRepository.create({
        ...sectionDto,
        project,
    });
    return this.sectionRepository.save(section);
  }

  async findAll(): Promise<Section[]> {
    return this.sectionRepository.find({ relations: ['project'] });
  }

  async findOne(id: number): Promise<Section> {
      const section = await this.sectionRepository.findOne({ where: { id }, relations: ['project'] });
      if (!section) {
          throw new NotFoundException(`Section with ID ${id} not found`);
      }
      return section;
  }

  async update(id: number, updateSectionDto: UpdateSectionDto): Promise<Section> {
      const { projectId, ...sectionDto } = updateSectionDto;
      const section = await this.sectionRepository.findOne({ where: { id }, relations: ['project'] });
      if (!section) {
          throw new NotFoundException(`Section with ID ${id} not found`);
      }

      if (projectId) {
          const project = await this.projectRepository.findOne({ where: { id: projectId } });
          if (!project) {
              throw new NotFoundException(`Project with ID ${projectId} not found`);
          }
          section.project = project;
      }

      Object.assign(section, sectionDto);
      return this.sectionRepository.save(section);
  }

  async remove(id: number): Promise<void> {
      const result = await this.sectionRepository.delete(id);
      if (result.affected === 0) {
          throw new NotFoundException(`Section with ID ${id} not found`);
      }
  }

}
