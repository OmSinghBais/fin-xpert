// src/feature-flags/feature-flags.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly prisma: PrismaService) {}

  async isEnabled(name: string): Promise<boolean> {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { name },
    });
    return flag?.enabled ?? false;
  }

  async setFlag(name: string, enabled: boolean) {
    return this.prisma.featureFlag.upsert({
      where: { name },
      update: { enabled },
      create: { name, enabled },
    });
  }

  listFlags() {
    return this.prisma.featureFlag.findMany();
  }
}
