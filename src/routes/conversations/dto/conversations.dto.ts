import { IsNotEmpty, IsString, Length } from "class-validator";

export class DTOEmptyConversation {
	@IsNotEmpty()
	@IsString()
	@Length(24, 24)
	public userId: string;
}