export enum Events {
	accountValidated = 'mailjet.account.validated',
	askActivationToken = 'mailjet.token.askActivation',
	askResetPwdToken = 'mailjet.token.askPwdReset',
}

export enum MailjetTemplate {
	accountValidated = 11,
	activationToken = 11,
	resetPwdToken = 11,
}
