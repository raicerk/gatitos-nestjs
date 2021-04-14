import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { Configuration } from 'src/config/config.keys';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      return {
        type: 'postgres',
        host: config.get(Configuration.HOST),
        port: Number(config.get(Configuration.DATABASEPORT)),
        database: config.get(Configuration.DATABASE),
        username: config.get(Configuration.USERNAME),
        password: config.get(Configuration.PASSWORD),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      } as ConnectionOptions;
    },
  }),
];
