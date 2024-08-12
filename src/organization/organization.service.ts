import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
  ) {}

  create(createOrgDto: CreateOrganizationDto): Promise<Organization> {
    return this.orgRepository.save(createOrgDto);
  }

  findAll() {
    return this.orgRepository.find();
  }

  findOne(id: number) {
    return this.orgRepository.findOneBy({id});
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return this.orgRepository.delete(id);
  }
}
