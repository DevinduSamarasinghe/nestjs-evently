import { Controller, Get, Post, Body, Param, Patch, Query, Req, Put } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Request } from "@nestjs/common";


@Controller('event')
export class EventController { 
    
    constructor(private readonly eventService: EventService) {}

    @Post()
    async create(@Body() createEventDto: CreateEventDto) {
        return this.eventService.create(createEventDto);
    }

    @Patch(':id')
    async update(@Param('id') eventId: string, @Body() updateEventDto: UpdateEventDto, @Req() req:Request) {

      const userId = req['userId'];
      return this.eventService.update(eventId, updateEventDto, userId); // Assuming userId comes from request
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.eventService.findById(id);
    }

    @Get('organizer/:userId')
    async findByOrganizer(@Param('userId') userId: string, @Query('page') page=1, @Query('limit') limit=6) {
      return this.eventService.findByOrganizer(userId, limit, page);
    }

    @Get()
    async findAll(@Query('query') query: string, @Query('category') cateogory: string, @Query('page') page=1, @Query('limit') limit=6){
        return this.eventService.findAll(query, cateogory, JSON.parse(String(page)), JSON.parse(String(limit)));
    }

    @Get('related/:categoryId/:eventId')
    async findRelated(@Param('categoryId') categoryId: string, @Param('eventId') eventId: string, @Query('page') page = 1, @Query('limit') limit = 3) {
        return this.eventService.findRelated(categoryId, eventId, Number(limit), Number(page));
    }

}