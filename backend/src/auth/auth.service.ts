import {
    Injectable,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { AdvisorsService } from '../advisors/advisors.service';
  import { RegisterAdvisorDto } from './dto/register-advisor.dto';
  import { LoginDto } from './dto/login.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly advisorsService: AdvisorsService,
      private readonly jwtService: JwtService,
    ) {}
  
    async register(dto: RegisterAdvisorDto) {
      const existing = await this.advisorsService.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('Advisor with this email already exists');
      }
  
      const passwordHash = await bcrypt.hash(dto.password, 10);
  
      const advisor = await this.advisorsService.createAdvisor({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
      });
  
      const token = await this.jwtService.signAsync({
        sub: advisor.id,
        email: advisor.email,
      });
  
      return {
        advisor: {
          id: advisor.id,
          name: advisor.name,
          email: advisor.email,
        },
        accessToken: token,
      };
    }
  
    async login(dto: LoginDto) {
      const advisor = await this.advisorsService.findByEmail(dto.email);
      if (!advisor) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isValid = await bcrypt.compare(dto.password, advisor.passwordHash);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const token = await this.jwtService.signAsync({
        sub: advisor.id,
        email: advisor.email,
      });
  
      return {
        advisor: {
          id: advisor.id,
          name: advisor.name,
          email: advisor.email,
        },
        accessToken: token,
      };
    }
  }
  