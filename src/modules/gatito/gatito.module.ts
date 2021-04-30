import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/user.repository';
import { GatitoController } from './gatito.controller';
import { GatitoRepository } from './gatito.repository';
import { GatitoService } from './gatito.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GatitoRepository, UserRepository]),
    AuthModule,
  ],
  controllers: [GatitoController],
  providers: [GatitoService],
})
export class GatitoModule {}
