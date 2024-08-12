import { Department } from 'src/department/entities/department.entity';
import { Priority, Project } from 'src/project/entities/project.entity';
import { Section } from 'src/section/entities/section.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

export enum TaskStatus {
    backlog = 'backlog',
    todo = 'todo',
    in_progress = 'in progress',
    qa_req = 'qa required',
    testing = 'testing',
    canceled = 'canceled',
    done = 'done'
}

export enum Difficulty {
    easy = "easy",
    medium = 'medium',
    hard = 'hard'
}

@Entity()
@Tree("closure-table")
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.backlog,
    })
    status: TaskStatus;

    @Column({
        type: 'enum',
        enum: Priority,
        default: Priority.low,
    })
    priority: Priority;

    @Column({
        type: 'enum',
        enum: Difficulty,
        nullable: true
    })
    difficulty: Difficulty;

    @TreeChildren()
    children: Task[];

    @TreeParent()
    parent: Task;

    @ManyToOne(() => User, user => user.tasks, {nullable: true})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Section, section => section.tasks, {nullable: true})
    @JoinColumn({ name: 'section_id' })
    section: Section;

    @ManyToOne(() => Department, department => department.tasks, {nullable: true})
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @ManyToOne(() => Project, project => project.tasks)
    @JoinColumn({ name: 'project_id' })
    project: Project;

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
}
