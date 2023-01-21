import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { zxcvbn } from "@zxcvbn-ts/core";

@ValidatorConstraint({ name: 'IsPasswordGuessable', async: false })
export class IsPasswordGuessableConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const safelyUnguessable = 3;
    const veryUnguessable = 4;

    const result = zxcvbn(password);
    return result.score === safelyUnguessable || result.score === veryUnguessable;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password "$value" is too guessable';
  }
}

export function IsPasswordGuessable(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordGuessable',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsPasswordGuessableConstraint,
    });
  };
}
