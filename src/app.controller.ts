import { Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post()
  // @UseInterceptors(FilesInterceptor('image'))
  // uploadFile(@UploadedFiles() file) {
  //   console.log(file);
  // }
}
