import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './typeorm.config';
import { OrganizationModule } from './organization/organization.module';
import { ProjectModule } from './project/project.module';
import { SectionModule } from './section/section.module';
import { TaskModule } from './task/task.module';
import { DepartmentModule } from './department/department.module';
import { FolderModule } from './folder/folder.module';
import { ChannelModule } from './channel/channel.module';
import { UserChannelModule } from './user-channel/user-channel.module';
import { MessageModule } from './message/message.module';
import { ReplyModule } from './reply/reply.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL prefix to access static files
    }),
    UserModule,
    AuthModule,
    OrganizationModule,
    ProjectModule,
    SectionModule,
    TaskModule,
    DepartmentModule,
    FolderModule,
    ChannelModule,
    UserChannelModule,
    MessageModule,
    ReplyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
