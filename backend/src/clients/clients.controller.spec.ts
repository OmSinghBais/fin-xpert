import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  const mockClientsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    getLoansForClient: jest.fn(),
    getGoalsForClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const mockClients = [
        {
          id: 'client-1',
          name: 'Test Client',
          email: 'test@example.com',
          phone: '1234567890',
        },
      ];

      mockClientsService.findAll.mockResolvedValue(mockClients);

      const result = await controller.findAll();

      expect(result).toEqual(mockClients);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single client', async () => {
      const clientId = 'client-1';
      const mockClient = {
        id: clientId,
        name: 'Test Client',
        email: 'test@example.com',
      };

      mockClientsService.findOne.mockResolvedValue(mockClient);

      const result = await controller.findOne(clientId);

      expect(result).toEqual(mockClient);
      expect(service.findOne).toHaveBeenCalledWith(clientId);
    });
  });

  describe('getLoans', () => {
    it('should return loans for a client', async () => {
      const clientId = 'client-1';
      const mockLoans = [
        {
          id: 'loan-1',
          clientId,
          amount: 100000,
          status: 'PENDING',
        },
      ];

      mockClientsService.getLoansForClient.mockResolvedValue(mockLoans);

      const result = await controller.getLoans(clientId);

      expect(result).toEqual(mockLoans);
      expect(service.getLoansForClient).toHaveBeenCalledWith(clientId);
    });
  });
});
