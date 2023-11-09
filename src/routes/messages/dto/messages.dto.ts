import { IsEnum, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { MessageContext, MessageType } from "../interfaces/messages.interface";


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

export class DTOMessageContext {
	@IsNotEmpty()
	@IsNumber()
	@IsEnum(MessageContext)
	public context: MessageContext;
}