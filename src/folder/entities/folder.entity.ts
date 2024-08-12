import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Department } from 'src/department/entities/department.entity';

@Entity()
@Tree("closure-table")
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  name: { [key: string]: string }; // Translatable name

  @TreeChildren()
  children: Folder[];

  @TreeParent()
  parent: Folder;

  @ManyToOne(() => Department, department => department.folders)
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
