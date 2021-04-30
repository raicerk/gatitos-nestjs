import { Test, TestingModule } from '@nestjs/testing';
import { GatitoService } from '../gatito.service';

describe('GatitosService', () => {
  let service: GatitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatitoService],
    }).compile();

    service = module.get<GatitoService>(GatitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
