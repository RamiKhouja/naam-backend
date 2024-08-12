import { Folder } from 'src/folder/entities/folder.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Task } from 'src/task/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json')
    name: { [key: string]: string };

    @Column({nullable: true})
    icon: string;

    @ManyToOne(() => Organization, organization => organization.departments)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @OneToMany(() => Task, task => task.section, {cascade: false})
    tasks: Task[];

    @OneToMany(() => Folder, folder => folder.department)
    folders: Folder[];
}
