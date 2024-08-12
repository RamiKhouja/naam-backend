import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class DepartmentService {

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const {organizationId, ...departmentDto} = createDepartmentDto;
    
    const organization = await this.orgRepository.findOne({where: {id: organizationId}});
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }

    const department = this.departmentRepository.create({
      ...departmentDto,
      organization
    });
    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOneBy({ id });
    if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
}

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    await this.departmentRepository.update(id, updateDepartmentDto);
    const updatedDepartment = await this.findOne(id);
    return updatedDepartment;
  }

  async remove(id: number): Promise<void> {
    const result = await this.departmentRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Department with ID ${id} not found`);
    }
  }
}
