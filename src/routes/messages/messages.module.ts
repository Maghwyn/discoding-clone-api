import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DatabaseModule } from '@/database/database.module';
import { MessagesService } from '@/routes/messages/messages.service';
import { MessagesController } from '@/routes/messages/messages.controller';
import { MessagesRepository } from '@/routes/messages/messages.repository';
import { ConversationsModule } from '@/routes/conversations/conversations.module';
import { RelationshipsModule } from '@/routes/relationship/relationship.module';
import { MessagesGateway } from '@/routes/messages/messages.gateway';
import { UsersModule } from '@/routes/users/users.module';

@Module({
	imports: [DatabaseModule.forRoot(), ConversationsModule, RelationshipsModule, UsersModule],
	providers: [JwtService, MessagesService, MessagesRepository, MessagesGateway],
	controllers: [MessagesController],
})
export class MessagesModule {}
