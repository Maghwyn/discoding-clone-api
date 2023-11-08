import { IsNotEmpty, IsString, Length, IsBoolean, ValidateNested, isArray, IsArray } from "class-validator";
import { Config, Role} from "@/routes/servers/interfaces/servers.interface"
import { Type } from "class-transformer";
import { ObjectId } from "mongodb";
export class DTOserverCreate {
  @IsNotEmpty()
  @IsString()
  @Length(2, 127)
  public name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 250)
  public bannerUrl: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 250)
  public iconUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  public isPublic: boolean;

}

export class DTOserverUpdate {
  @IsNotEmpty()
  @IsString()
  @Length(2, 127)
  public name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 250)
  public bannerUrl: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 250)
  public iconUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  public isPublic: boolean;

  @ValidateNested()
  @Type(() => DTOconfig)
  public config: Config;

  @IsArray()
  public members: Array<string>

  @IsNotEmpty()
  @IsString()
  public _id: string
}

class DTOconfig {

  @ValidateNested()
  @Type(() => DTOrole)
  public roles : Array<Role>
}

class DTOrole {
  @IsNotEmpty()
  @IsString()
  @Length(2, 127)
  public name: string;
}
