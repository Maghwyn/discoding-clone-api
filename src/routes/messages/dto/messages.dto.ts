import { IsEnum, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { MessageContext } from "@/routes/messages/interfaces/messages.interface";

export class DTOContextContentMessage {
	@IsNotEmpty()
	@IsString()
	@Length(24, 24)
	public contextId: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 1000)
	public content: string;
}

export class DTOContextMessage {
	@IsNotEmpty()
	@IsString()
	@Length(24, 24)
	public contextId: string;
}

export class DTOContextTypeMessage {
	@IsNotEmpty()
	@IsNumber()
	@IsEnum(MessageContext)
	public context: MessageContext;
}