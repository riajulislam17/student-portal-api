import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { ROLES } from 'src/common/enum/roles';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsIn(ROLES)
  role: string;
}
