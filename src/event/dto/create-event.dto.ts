import { IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsDate()
  startDateTime?: Date;

  @IsOptional()
  @IsDate()
  endDateTime?: Date;

  @IsString()
  price: string;

  @IsBoolean()
  isFree: boolean;

  @IsOptional()
  @IsString()
  url?: string;

  @IsString()  // This should be a reference to the Category ObjectId
  category: Types.ObjectId;  // Accepts ObjectId as string
  
  @IsString()  // This should be a reference to the User ObjectId (organizer)
  organizer: Types.ObjectId;  // Accepts ObjectId as string
}
