import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConsentService } from './consent.service';
import { ConsentController } from './consent.controller';

@Module({
  imports: [PrismaModule],
  providers: [ConsentService],
  controllers: [ConsentController],
})
export class ConsentModule {}

