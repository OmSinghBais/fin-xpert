import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdvisorsModule } from '../advisors/advisors.module';
import { JwtStrategy } from './jwt.strategy';

const JWT_SECRET = 'FINXPERT_SUPER_SECRET_KEY_123'; // <== single source of truth

@Module({
  imports: [
    AdvisorsModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
