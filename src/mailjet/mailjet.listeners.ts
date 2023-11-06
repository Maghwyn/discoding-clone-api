import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { config } from '@/config/config';
import { MailjetService } from '@/mailjet/mailjet.service';
import { MailjetEmail, MailjetAskToken } from '@/auth/events/auth.events.req';
import { Events, MailjetTemplate } from '@/mailjet/interfaces/events.interface';

Injectable();
export class MailjetListeners {
	constructor(
		@Inject(MailjetService)
		private readonly mailjetService: MailjetService,
	) {}

	@OnEvent(Events.accountValidated)
	async handleAccountValidated(payload: MailjetEmail) {
		const { email } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.accountValidated,
			recipients: [{ Email: email }],
		});
	}

	@OnEvent(Events.askActivationToken)
	async handleaskActivationToken(payload: MailjetAskToken) {
		const { email, token } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.activationToken,
			recipients: [{ Email: email }],
			args: { code: token },
		});
	}

	@OnEvent(Events.askResetPwdToken)
	async handleaskResetToken(payload: MailjetAskToken) {
		const { email, token } = payload;
		const url = `${config.app.redirect}/forgot-password?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.resetPwdToken,
			recipients: [{ Email: email }],
			args: { url },
		});
	}
}
