import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, Department])],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
