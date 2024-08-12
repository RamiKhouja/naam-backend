import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelMemberInfoDto, CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @Req() req) {
    const userId = req.user?.id;
    return this.channelService.create(createChannelDto, userId);
  }

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/mine')
  getMyChannels(@Req() req) {
    const userId = req.user?.id;
    return this.channelService.getMyChannels(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  async getChannelMembers(@Param('id') channelId: number): Promise<ChannelMemberInfoDto[]> {
    return this.channelService.getChannelMembers(channelId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }

  @Get('add-user/:id/:idUser')
  addUser(@Param('id') id: string, @Param('idUser') idUser: string) {
    return this.channelService.addUser(+id, +idUser);
  }

}
