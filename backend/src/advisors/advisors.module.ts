import { Module } from '@nestjs/common';
import { AdvisorsService } from './advisors.service';
import { AdvisorsController } from './advisors.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AdvisorsService],
  controllers: [AdvisorsController],
  exports: [AdvisorsService],
})
export class AdvisorsModule {}
