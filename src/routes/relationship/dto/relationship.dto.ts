import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RelationshipType } from "@/routes/relationship/interfaces/relationship.interface";

export class DTOCreateRelationShip {
	@IsNotEmpty()
	@IsString()
	public username: string;

	@IsNotEmpty()
	@IsNumber()
	@IsEnum(RelationshipType)
	public type: RelationshipType;
}