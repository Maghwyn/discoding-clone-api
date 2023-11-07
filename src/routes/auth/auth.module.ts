import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { config } from '@/config/config';
import { AuthService } from '@/routes/auth/auth.service';
import { AuthController } from '@/routes/auth/auth.controller';
import { JwtStrategy } from '@/routes/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/routes/auth/strategies/local.strategy';
import { UsersModule } from '@/routes/users/users.module';
import { AuthEventEmitter } from '@/routes/auth/events/auth.events';
import { MailjetListeners } from '@/mailjet/mailjet.listeners';
import { MailjetModule } from '@/mailjet/mailjet.module';
import { TokensRepository } from '@/routes/auth/tokens.repository';
import { DatabaseModule } from '@/database/database.module';

@Module({
	imports: [
		DatabaseModule.forRoot(),
		UsersModule,
		MailjetModule,
		PassportModule,
		JwtModule.register({
			secret: config.jwt.secret,
			signOptions: { expiresIn: '7d' },
		}),
	],
	providers: [
		AuthService,
		JwtStrategy,
		LocalStrategy,
		TokensRepository,
		AuthEventEmitter,
		MailjetListeners,
	],
	controllers: [AuthController],
})
export class AuthModule {}
