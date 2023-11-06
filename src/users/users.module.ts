import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { UsersController } from '@/users/users.controller';
import { UsersRepository } from '@/users/users.repository';
import { UsersService } from '@/users/users.service';

@Module({
	imports: [DatabaseModule.forRoot()],
	providers: [UsersService, UsersRepository],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
