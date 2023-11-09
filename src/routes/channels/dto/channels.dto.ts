import { IsNotEmpty, IsString, Length } from "class-validator";
export class DTOchannelCreate {
  @IsNotEmpty()
  @IsString()
  @Length(2, 127)
  public name: string;

  @IsNotEmpty()
  public type: ChannelType;

  @IsNotEmpty()
  @IsString()
  @Length(2, 250)
  public serverId: string;

}

export class DTOChannelUpdate {

  @IsNotEmpty()
  @IsString()
  public _id: string

  @IsNotEmpty()
  @IsString()
  @Length(2, 127)
  public name: string;

}

type ChannelType = 'text' | 'audio';
