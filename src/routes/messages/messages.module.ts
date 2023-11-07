import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { MessagesService } from '@/routes/messages/messages.service';
import { MessagesController } from '@/routes/messages/messages.controller';
import { MessagesRepository } from '@/routes/messages/messages.repository';

@Module({
	imports: [DatabaseModule.forRoot()],
	providers: [MessagesService, MessagesRepository],
	controllers: [MessagesController],
})
export class MessagesModule {}
