import { Module } from '@nestjs/common';
import MJ, { Client } from 'node-mailjet';

import { config } from '@/config/config';
import { MailjetService } from '@/mailjet/mailjet.service';

@Module({
	providers: [
		{
			provide: 'MAILJET_CLIENT',
			useFactory: async (): Promise<Client> => {
				const mailjet = MJ.apiConnect(config.mailjet.user, config.mailjet.pass);

				return mailjet;
			},
		},
		MailjetService,
	],
	exports: [MailjetService],
})
export class MailjetModule {}
