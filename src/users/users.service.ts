import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/users.schema";

@Injectable()
export class UserService{

    constructor(@InjectModel(User.name) 
    private userModel: Model<User>) {}
    
    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = new this.userModel(createUserDto);
        return newUser.save()
    }

    async findById(id: string): Promise<User> {
        const user = await this.userModel.findById(id);
        if(!user){
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User>{ 

        const updateUser = await this.userModel.findOneAndUpdate({clerkId: id}, updateUserDto,{new: true}).exec();

        if(!updateUser){
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return updateUser;
    }

    async remove(id: string): Promise<User> {
        return this.userModel.findOneAndDelete({clerkId: id}).exec();
    }
}


