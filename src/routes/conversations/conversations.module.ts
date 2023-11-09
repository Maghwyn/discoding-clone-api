import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { ConversationsService } from '@/routes/conversations/conversations.service';
import { ConversationsController } from '@/routes/conversations/conversations.controller';
import { ConversationsRepository } from '@/routes/conversations/conversations.repository';

@Module({
	imports: [DatabaseModule.forRoot()],
	providers: [ConversationsService, ConversationsRepository],
	controllers: [ConversationsController],
	exports: [ConversationsService]
})
export class ConversationsModule {}
