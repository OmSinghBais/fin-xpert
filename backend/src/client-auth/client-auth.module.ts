import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'client-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [ClientAuthService],
  controllers: [ClientAuthController],
  exports: [ClientAuthService],
})
export class ClientAuthModule {}
