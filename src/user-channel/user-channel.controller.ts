import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserChannelService } from './user-channel.service';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';
import { UpdateUserChannelDto } from './dto/update-user-channel.dto';

@Controller('user-channel')
export class UserChannelController {
  constructor(private readonly userChannelService: UserChannelService) {}

  @Post()
  create(@Body() createUserChannelDto: CreateUserChannelDto) {
    return this.userChannelService.create(createUserChannelDto);
  }

  @Get()
  findAll() {
    return this.userChannelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userChannelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserChannelDto: UpdateUserChannelDto) {
    return this.userChannelService.update(+id, updateUserChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userChannelService.remove(+id);
  }
}
