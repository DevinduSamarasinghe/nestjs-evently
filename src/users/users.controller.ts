import { Controller, Get, Post, Body, Param, Patch, Delete } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() CreateUserDto: CreateUserDto){
        return this.userService.create(CreateUserDto);
    }

    @Get(':id')
    async findById(@Param('id') id:string){
        return this.userService.findById(id);
    }

    @Patch(':id')
    async update(@Param('id') id:string, @Body() UpdateUserDto: UpdateUserDto){
        return this.userService.update(id, UpdateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}