import {
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  
  import { PrismaService } from '../prisma/prisma.service';
  import { JwtService } from '@nestjs/jwt';
  
  import * as bcrypt from 'bcrypt';
  @Injectable()
export class ClientAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(phone: string, password: string) {
    const client = await this.prisma.client.findFirst({
      where: { phone },
    });

    if (!client) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, client.passwordHash!);
    if (!valid) throw new UnauthorizedException();

    const token = this.jwtService.sign({
      clientId: client.id,
      role: 'CLIENT',
    });

    return { token };
  }
}
