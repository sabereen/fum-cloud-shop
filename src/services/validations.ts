import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator"

export function IsPhone(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isPhone",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    // a valid phone number is "+989373495981"
                    return typeof value === 'string' && /^\+\d{12}$/.test(value)
                }
            }
        });
    };
}