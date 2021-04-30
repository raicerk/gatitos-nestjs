import { Test, TestingModule } from '@nestjs/testing';
import { GatitoController } from '../gatito.controller';

describe('GatitoController', () => {
  let controller: GatitoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatitoController],
    }).compile();

    controller = module.get<GatitoController>(GatitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
