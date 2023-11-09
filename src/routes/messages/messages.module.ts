import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { MessagesService } from '@/routes/messages/messages.service';
import { MessagesController } from '@/routes/messages/messages.controller';
import { MessagesRepository } from '@/routes/messages/messages.repository';
import { ConversationsModule } from '@/routes/conversations/conversations.module';
import { RelationshipsModule } from '@/routes/relationship/relationship.module';
import { UsersModule } from '@/routes/users/users.module';

@Module({
	imports: [DatabaseModule.forRoot(), ConversationsModule, RelationshipsModule, UsersModule],
	providers: [MessagesService, MessagesRepository],
	controllers: [MessagesController],
})
export class MessagesModule {}
