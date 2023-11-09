import { IsNotEmpty, IsString, Length } from "class-validator";


export class DTOSendPrivateMessage {
	@IsNotEmpty()
	@IsString()
	@Length(24, 24)
	public contextId: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 1000)
	public content: string;
}

export class DTOEditMessage {
	@IsNotEmpty()
	@IsString()
	@Length(1, 1000)
	public content: string;
}