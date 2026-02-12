import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdvisorsService } from '../advisors/advisors.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let advisorsService: AdvisorsService;
  let jwtService: JwtService;

  const mockAdvisorsService = {
    findByEmail: jest.fn(),
    createAdvisor: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AdvisorsService,
          useValue: mockAdvisorsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // These are available for test assertions if needed
    advisorsService = module.get<AdvisorsService>(AdvisorsService);
    jwtService = module.get<JwtService>(JwtService);
    
    // Suppress unused variable warnings in tests
    void advisorsService;
    void jwtService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new advisor successfully', async () => {
      const registerDto = {
        name: 'Test Advisor',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      const mockAdvisor = {
        id: 'advisor-1',
        name: registerDto.name,
        email: registerDto.email,
        phone: registerDto.phone,
        passwordHash: 'hashedPassword',
        createdAt: new Date(),
      };

      mockAdvisorsService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockAdvisorsService.createAdvisor.mockResolvedValue(mockAdvisor);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('advisor');
      expect(result).toHaveProperty('accessToken', 'jwt-token');
      expect(result.advisor.email).toBe(registerDto.email);
      expect(mockAdvisorsService.createAdvisor).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        name: 'Test Advisor',
        email: 'existing@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      mockAdvisorsService.findByEmail.mockResolvedValue({ id: 'existing' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockAdvisor = {
        id: 'advisor-1',
        name: 'Test Advisor',
        email: loginDto.email,
        passwordHash: 'hashedPassword',
      };

      mockAdvisorsService.findByEmail.mockResolvedValue(mockAdvisor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('advisor');
      expect(result).toHaveProperty('accessToken', 'jwt-token');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockAdvisor.id,
        email: mockAdvisor.email,
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockAdvisorsService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockAdvisor = {
        id: 'advisor-1',
        email: loginDto.email,
        passwordHash: 'hashedPassword',
      };

      mockAdvisorsService.findByEmail.mockResolvedValue(mockAdvisor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
