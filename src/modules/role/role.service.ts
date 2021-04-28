import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';
import { RoleStatus } from './rolestatus.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<ReadRoleDto> {
    if (!id) {
      throw new BadRequestException('Id musr be sent');
    }

    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return plainToClass(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: RoleStatus.ACTIVE },
    });
    return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
  }

  async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    const savedRole: Role = await this._roleRepository.save(role);
    return plainToClass(ReadRoleDto, savedRole);
  }

  async update(id: number, role: Partial<UpdateRoleDto>): Promise<void> {
    await this._roleRepository.update(id, role);
  }

  async delete(id: number): Promise<void> {
    const roleExists = await this._roleRepository.findOne(id, {
      where: {
        status: RoleStatus.ACTIVE,
      },
    });

    if (!roleExists) {
      throw new NotFoundException();
    }

    await this._roleRepository.update(id, { status: RoleStatus.INACTIVE });
  }
}
