import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { Category, CategorySchema } from "./schema/category.schema";
import { ClerkAuthMiddleware } from "src/middleware";
import { MiddlewareBuilder } from "@nestjs/core";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
})

export class CategoryModule {   
    configure(consumer:MiddlewareConsumer) {
        consumer.apply(ClerkAuthMiddleware)
        .exclude({path: 'category', method: RequestMethod.GET})
        .exclude({path: 'category/:id', method: RequestMethod.GET})
        .forRoutes(CategoryController);
    }
}   

