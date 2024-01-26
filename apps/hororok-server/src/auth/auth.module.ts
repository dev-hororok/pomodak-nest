import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { AccountsModule } from '../accounts/accounts.module';
import { SharedAuthModule } from '@app/auth';

@Module({
  imports: [AccountsModule, SharedAuthModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
