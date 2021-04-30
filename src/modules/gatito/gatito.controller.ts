import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/user.decorator';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { CreateGatitoDto, ReadGatitoDto, UpdateGatitoDto } from './dtos';
import { GatitoService } from './gatito.service';

@Controller('gatito')
export class GatitoController {
  constructor(private readonly _gatitoService: GatitoService) {}

  @Get(':id')
  getGatito(@Param('id', ParseIntPipe) id: number): Promise<ReadGatitoDto> {
    return this._gatitoService.get(id);
  }

  @Get('author/:authorId')
  getGatitoByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<ReadGatitoDto[]> {
    return this._gatitoService.getGatitoByAuthor(authorId);
  }

  @Get()
  getGatitos(): Promise<ReadGatitoDto[]> {
    return this._gatitoService.getAll();
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createGatito(@Body() role: Partial<CreateGatitoDto>): Promise<ReadGatitoDto> {
    return this._gatitoService.create(role);
  }

  createGatitoByAuthor(
    @Body() role: Partial<CreateGatitoDto>,
    @GetUser('id') authorId: number,
  ): Promise<ReadGatitoDto> {
    return this._gatitoService.createByAuthor(role, authorId);
  }

  @Patch(':id')
  updateGatito(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Partial<UpdateGatitoDto>,
    @GetUser('id') authorId: number,
  ): Promise<void> {
    return this._gatitoService.update(id, role, authorId);
  }

  @Delete(':id')
  deleteGatito(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this._gatitoService.delete(id);
  }
}
