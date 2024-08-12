import { Department } from 'src/department/entities/department.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  website: string;

  @Column()
  email: string;

  @Column({nullable: true})
  phone: string;

  @Column()
  nb_emp: number;

  @Column()
  rn: string;

  @Column()
  vat: string;

  @Column({nullable: true})
  rn_img: string;

  @Column({nullable: true})
  vat_img: string;

  @OneToMany(() => User, user => user.organization)
  users: User[];

  @OneToMany(() => Department, department => department.organization)
  departments: Department[];

  @OneToMany(() => Project, project => project.organization)
  projects: Project[];
}
