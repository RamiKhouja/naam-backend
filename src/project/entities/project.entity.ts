import { Organization } from 'src/organization/entities/organization.entity';
import { Section } from 'src/section/entities/section.entity';
import { Task } from 'src/task/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

export enum Status {
    not_started = 'not started',
    in_progress = 'in progress',
    waiting = 'waiting',
    delayed = 'delayed',
    done = 'done'
}

export enum Priority {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.not_started,
    })
    status: Status;

    @Column({
        type: 'enum',
        enum: Priority,
        default: Priority.low,
    })
    priority: Priority;

    @Column({
        type: 'date',
        nullable: true
    })
    start_date: string;

    @Column({
        type: 'date',
        nullable: true
    })
    due_date: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Organization, organization => organization.projects)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @OneToMany(() => Section, section => section.project, {cascade: true})
    sections: Section[];

    @OneToMany(() => Task, task => task.project, {cascade: true})
    tasks: Task[];
}
