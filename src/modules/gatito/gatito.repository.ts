import { EntityRepository, Repository } from 'typeorm';
import { Gatito } from './gatito.entity';

@EntityRepository(Gatito)
export class GatitoRepository extends Repository<Gatito> {}
