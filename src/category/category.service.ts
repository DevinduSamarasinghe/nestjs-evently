import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "./schema/category.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable() //makes this class injectable to other classes in the application 
export class CategoryService {

    //Inject the model into the service
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const newCategory = new this.categoryModel(createCategoryDto);
        return newCategory.save();
    }

    async findAll():Promise<Category[]> {
        return this.categoryModel.find().exec();
    }

    async findById(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id);

        if(!category){
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return category;
    }

    async findByName(name: string): Promise<Category> {
        const category = await this.categoryModel.findOne({
          name: { $regex: name, $options: 'i' },
        }).exec();

        if (!category) {
          throw new NotFoundException('Category not found');
        }
        return category;
      }
}