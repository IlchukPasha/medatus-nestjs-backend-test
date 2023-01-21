import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { IsPasswordGuessable } from "../validators/is-password-guessable.validator";
import { Transform } from "class-transformer";

export class UserCredentialsDto {
  @IsString()
  @MaxLength(254)
  @Matches(/^([a-zA-Z0-9\-\.]{2,63})@([a-zA-Z0-9\-\.]+)\.([a-zA-Z]{2,5})$/, { message: 'invalid email format' })
  @Transform((obj) => obj.value.toLowerCase())
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsPasswordGuessable()
  password: string;
}
