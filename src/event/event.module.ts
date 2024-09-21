import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event, EventSchema } from './schema/event.schema';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { Category, CategorySchema } from 'src/category/schema/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
