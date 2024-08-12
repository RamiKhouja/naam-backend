import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Section {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Project, project => project.sections)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @OneToMany(() => Task, task => task.section, {cascade: false})
    tasks: Task[];
}
