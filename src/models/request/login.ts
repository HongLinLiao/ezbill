import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LoginType } from '../../enums/LoginType';

export class SignInRequest {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(LoginType)
  type: LoginType;
}
