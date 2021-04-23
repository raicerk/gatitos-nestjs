import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.GENERAL)
  @UseGuards(AuthGuard(), RoleGuard)
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this._userService.get(id);
    return user;
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.GENERAL, RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this._userService.getAll();
    return users;
  }

  @UseGuards(AuthGuard())
  @Post()
  async createUser(@Body() user: User): Promise<User> {
    const createdUser = await this._userService.create(user);
    return createdUser;
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    const updatedUser = await this._userService.update(id, user);
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deletedUser = await this._userService.delete(id);
    return deletedUser;
  }

  @HttpCode(200)
  @Post('setRole/:userId/:roleId')
  async setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<void> {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
