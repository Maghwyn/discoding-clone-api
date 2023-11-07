import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { UsersController } from '@/routes/users/users.controller';
import { UsersRepository } from '@/routes/users/users.repository';
import { UsersService } from '@/routes/users/users.service';

@Module({
	imports: [DatabaseModule.forRoot()],
	providers: [UsersService, UsersRepository],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
