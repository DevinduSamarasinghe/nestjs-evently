import { Module, MiddlewareConsumer, RequestMethod} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";
import {User, UserSchema} from "./schemas/users.schema";
import { ClerkAuthMiddleware } from "src/middleware";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    controllers: [UsersController],
    providers: [UserService],
})

export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(ClerkAuthMiddleware)
        .exclude({path: 'users', method: RequestMethod.POST})
        .forRoutes(UsersController);
    }
}

