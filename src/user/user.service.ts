import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File ): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const organization = await this.orgRepository.findOne({where: {id: createUserDto.organizationId}});
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${createUserDto.organizationId} not found`);
    }

    const newUser:User = this.usersRepository.create(createUserDto);

    newUser.organization= organization;
    
    if (file) {
      newUser.image = file.filename; // Save the file name
    }
    return this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({where: {id: id}, relations: ['organization']});
  }

  findByMail(email: string) {
    return this.usersRepository.findOneBy({email: email});
  }

  async update(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['organization'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if(updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    // Update user fields
    Object.assign(user, updateUserDto);

    if (file) {
      user.image = file.filename; // Update the image field if a new file is uploaded
    }

    return this.usersRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUsersByOrganization(organizationId: number, userId: number): Promise<User[]> {
    // Fetch the user making the request
    const requestingUser = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['organization'],
    });

    if (!requestingUser) {
        throw new NotFoundException('Requesting user not found');
    }

    // Check if the requesting user's organization ID matches the provided organization ID
    if (requestingUser.organization.id != organizationId) {
        throw new UnauthorizedException('You do not have access to this organization');
    }

    // Fetch and return users in the specified organization
    return this.usersRepository.find({
        where: { organization: { id: organizationId } },
    });
}
}
