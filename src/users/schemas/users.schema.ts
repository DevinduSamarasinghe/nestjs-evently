import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true})

export class User extends Document {
    
    @Prop({required: true, unique: true})
    clerkId: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true, unique: true})
    username: string;

    @Prop({required: true})
    firstName: string;

    @Prop({required: true})
    lastName: string;

    @Prop()
    photo?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);