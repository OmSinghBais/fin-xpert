import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdvisorsService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.advisor.findUnique({
      where: { email },
    });
  }

  createAdvisor(data: {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
  }) {
    return this.prisma.advisor.create({ data });
  }

  findAll() {
    return this.prisma.advisor.findMany();
  }
}
