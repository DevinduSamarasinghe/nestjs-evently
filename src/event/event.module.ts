import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event, EventSchema } from './schema/event.schema';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { ClerkAuthMiddleware } from 'src/middleware';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [EventController],
  providers: [EventService, CategoryService],
})
export class EventModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClerkAuthMiddleware)
      .exclude({ path: 'event', method: RequestMethod.GET }) // Exclude the root GET /event (findAll)
      .exclude({path: 'event/related/:categoryId/:eventId', method: RequestMethod.GET}) // Exclude the GET /event/related/:categoryId/:eventId
      .forRoutes(EventController); // Apply middleware to other routes in EventController
  }
}
