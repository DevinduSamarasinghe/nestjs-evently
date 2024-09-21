import { IsString, isEmail, IsOptional, isString, IsEmail } from "class-validator";

export class CreateUserDto {

    @IsString()
    readonly clerkId: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly username: string;

    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;
    
    @IsOptional()
    @IsString()
    readonly photo?: string;
}

