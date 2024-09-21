import { Controller, Post, Get, Body, Param } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./schema/category.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    async findAll(): Promise<Category[]>{
        return this.categoryService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Category> {
        return this.categoryService.findById(id);
    }

    @Get('name/:name')
    async findByName(@Param('name') name: string): Promise<Category> {
        return this.categoryService.findByName(name);
    }
}

