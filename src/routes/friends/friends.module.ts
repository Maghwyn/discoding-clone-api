import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { FriendsService } from '@/routes/friends/friends.service';
import { FriendsController } from '@/routes/friends/friends.controller';
import { FriendsRepository } from '@/routes/friends/friends.repository';

@Module({
	imports: [DatabaseModule.forRoot()],
	providers: [FriendsService, FriendsRepository],
	controllers: [FriendsController],
})
export class FriendsModule {}
