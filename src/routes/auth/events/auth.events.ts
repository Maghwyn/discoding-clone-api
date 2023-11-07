import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MailjetEmail, MailjetAskToken } from '@/routes/auth/events/auth.events.req';
import { Events } from '@/mailjet/interfaces/events.interface';

@Injectable()
export class AuthEventEmitter {
	constructor(private eventEmitter: EventEmitter2) {}

	async accountValidated(email: string) {
		this.eventEmitter.emit(Events.accountValidated, new MailjetEmail(email));
	}

	async askActivationToken(email: string, token: string) {
		this.eventEmitter.emit(Events.askActivationToken, new MailjetAskToken(email, token));
	}

	async askResetPwdToken(email: string, token: string) {
		this.eventEmitter.emit(Events.askResetPwdToken, new MailjetAskToken(email, token));
	}
}
