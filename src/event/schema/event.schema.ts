import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { User } from 'src/users/schemas/users.schema';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  location?: string;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop()
  imageUrl: string;

  @Prop()
  startDateTime: Date | null;

  @Prop()
  endDateTime: Date | null;

  @Prop()
  price: string;

  @Prop({ default: false })
  isFree: boolean;

  @Prop()
  url: string;

  @Prop({ type: 'ObjectId', ref: 'Category' })
  category: Category;

  @Prop({ type: 'ObjectId', ref: 'User' })
  organizer: User;
}

export const EventSchema = SchemaFactory.createForClass(Event);
