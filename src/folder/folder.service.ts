import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { Department } from 'src/department/entities/department.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: TreeRepository<Folder>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createFolderDto: CreateFolderDto): Promise<Folder> {
    const { departmentId, parentId, name } = createFolderDto;

    const department = await this.departmentRepository.findOne({where: {id: departmentId}});
    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    let parent: Folder = null;
    if (parentId) {
      parent = await this.folderRepository.findOne({where: {id: parentId}});
      if (!parent) {
        throw new NotFoundException(`Parent folder with ID ${parentId} not found`);
      }
    }

    const folder = this.folderRepository.create({
      name,
      department,
      parent,
    });

    return this.folderRepository.save(folder);
  }

  async findAll(): Promise<Folder[]> {
    return this.folderRepository.findTrees();
  }

  async findOne(id: number): Promise<Folder> {
    const folder = await this.folderRepository.findOne({where: {id}, relations: ['department', 'parent', 'children'] });
    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }
    return folder;
  }

  async update(id: number, updateFolderDto: UpdateFolderDto): Promise<Folder> {
    const folder = await this.findOne(id);
    const { departmentId, parentId, name } = updateFolderDto;

    if (departmentId) {
      const department = await this.departmentRepository.findOne({where: {id: departmentId}});
      if (!department) {
        throw new NotFoundException(`Department with ID ${departmentId} not found`);
      }
      folder.department = department;
    }

    if (parentId) {
      const parent = await this.folderRepository.findOne({where: {id: parentId}});
      if (!parent) {
        throw new NotFoundException(`Parent folder with ID ${parentId} not found`);
      }
      folder.parent = parent;
    }

    if (name) {
      folder.name = name;
    }

    return this.folderRepository.save(folder);
  }

  async remove(id: number): Promise<void> {
    const folder = await this.findOne(id);
    await this.folderRepository.remove(folder);
  }
}
