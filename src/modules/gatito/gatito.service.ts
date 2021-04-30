import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserStatus } from '../user/userstatus.enum';
import { CreateGatitoDto, ReadGatitoDto, UpdateGatitoDto } from './dtos';
import { Gatito } from './gatito.entity';
import { GatitoRepository } from './gatito.repository';
import { GatitoStatus } from './gatitostatus.enum';

@Injectable()
export class GatitoService {
  constructor(
    @InjectRepository(GatitoRepository)
    private readonly _gatitoRepository: GatitoRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(gatitoId: number): Promise<ReadGatitoDto> {
    if (!gatitoId) {
      throw new BadRequestException('gatitoId must be sent');
    }

    const gatito = await this._gatitoRepository.findOne(gatitoId, {
      where: { status: GatitoStatus.ACTIVE },
    });

    if (!gatito) {
      throw new NotFoundException('gatito does not exist');
    }

    return plainToClass(ReadGatitoDto, gatito);
  }

  async getAll(): Promise<ReadGatitoDto[]> {
    const gatitos: Gatito[] = await this._gatitoRepository.find({
      where: { status: GatitoStatus.ACTIVE },
    });

    return gatitos.map((gatito: Gatito) => plainToClass(ReadGatitoDto, gatito));
  }

  async getGatitoByAuthor(gatitoId): Promise<ReadGatitoDto[]> {
    if (!gatitoId) throw new BadRequestException('id must be sent');
    const gatitos: Gatito[] = await this._gatitoRepository.find({
      where: { status: GatitoStatus.ACTIVE, authors: In([gatitoId]) },
    });
    return gatitos.map((gatito: Gatito) => plainToClass(ReadGatitoDto, gatito));
  }

  async create(gatito: Partial<CreateGatitoDto>): Promise<ReadGatitoDto> {
    const { name, description } = gatito;
    let authors: User[] = [];

    for (const authorId of gatito.authors) {
      const authorExists = await this._userRepository.findOne(authorId, {
        where: { status: UserStatus.ACTIVE },
      });

      if (!authorExists) {
        throw new NotFoundException(
          `There's not an author with this Id: ${authorId}`,
        );
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(
          `This user ${authorId} is not an author`,
        );
      }

      authors = [authorExists];
    }

    const savedGatito: Gatito = await this._gatitoRepository.save({
      name,
      description,
      authors,
    });

    return plainToClass(ReadGatitoDto, savedGatito);
  }

  async createByAuthor(
    gatito: Partial<CreateGatitoDto>,
    authorId: number,
  ): Promise<ReadGatitoDto> {
    const { name, description } = gatito;
    const author = await this._userRepository.findOne(authorId, {
      where: { status: UserStatus.ACTIVE },
    });

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.AUTHOR,
    );

    if (!isAuthor) {
      throw new UnauthorizedException(`This user ${authorId} is not an author`);
    }

    const savedGatito: Gatito = await this._gatitoRepository.save({
      name,
      description,
      author,
    });

    return plainToClass(ReadGatitoDto, savedGatito);
  }

  async update(
    gatitoId: number,
    gatito: Partial<UpdateGatitoDto>,
    authorId: number,
  ): Promise<void> {
    const gatitoExists = await this._gatitoRepository.findOne(gatitoId, {
      where: { status: GatitoStatus.ACTIVE },
    });

    if (!gatitoExists) {
      throw new NotFoundException('This gatito does not exists');
    }

    const isOwnGatito = gatitoExists.authors.some(
      (author) => author.id === authorId,
    );

    if (!isOwnGatito) {
      throw new UnauthorizedException(`This user isn't the gatito's author`);
    }

    await this._gatitoRepository.update(gatitoId, gatito);
  }

  async delete(gatitoId: number): Promise<void> {
    const gatitoExists = await this._gatitoRepository.findOne(gatitoId, {
      where: {
        status: GatitoStatus.ACTIVE,
      },
    });
    if (!gatitoExists) {
      throw new NotFoundException('This gatito does not exists');
    }

    await this._gatitoRepository.update(gatitoId, {
      status: GatitoStatus.INACTIVE,
    });
  }
}
