import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Event } from "./schema/event.schema";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { User } from "src/users/schemas/users.schema";
import { Category } from "src/category/schema/category.schema";
import { CategoryService } from "src/category/category.service";

@Injectable()
export class EventService {

    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        private readonly categoryService: CategoryService
    ) {}

    async create(createEventDto: CreateEventDto): Promise<Event> {
        const organizer = await this.userModel.findById(createEventDto.organizer);

        //check if the user exists
        if(!organizer){
            throw new NotFoundException(`User with id ${createEventDto.organizer} not found`);
        }

        //check if the category exists
        const category = await this.categoryModel.findById(createEventDto.category);
        if(!category){
            throw new NotFoundException(`Category with id ${createEventDto.category} not found`);
        }

        const newEvent = new this.eventModel({
            ...createEventDto,
            organizer: organizer._id,
            category: category._id
        });

        return newEvent.save();
    }

  // UPDATE EVENT
  async update(eventId: string, updateEventDto: UpdateEventDto, userId: string): Promise<Event> {
    
    const eventToUpdate = await this.eventModel.findById(eventId);
    if (!eventToUpdate) {
      throw new NotFoundException('Event not found');
    }

    if(!userId){
      throw new NotFoundException('User not found');
    }

    // Check if the current user is the organizer
    if (eventToUpdate.organizer.toString() !== userId) {
      throw new UnauthorizedException('Unauthorized: You are not the organizer of this event');
    }

    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      eventId,
      { ...updateEventDto },
      { new: true },
    );

    return updatedEvent;
  }

    //get event by Id
    async findById(id: string): Promise<Event> {
        const event = await this.eventModel.findById(id)
        .populate('organizer', '_id firstName lastName email')
        .populate('category', '_id name')
        .exec();

        if(!event){
            throw new NotFoundException(`Event with id ${id} not found`);
        }

        return event;
    }

    //get all events by organizer
    async findByOrganizer(userId: string, limit=6, page=1): Promise<{data: Event[], totalPages: number}> {
        
        const skipAmount = (page -1 ) * limit;

        const events = await this.eventModel.find({organizer: userId})
        .sort({createdAt: -1})
        .skip(skipAmount)
        .limit(limit)
        .populate('organizer', '_id firstName lastName email')
        .populate('category', '_id name')
        .exec();

        const eventsCount = await this.eventModel.countDocuments({organizer: userId}).exec();

        return {data: events, totalPages: Math.ceil(eventsCount / limit)};
    }

    //GetAllEvents with optional query and category filtering 
    async findAll(query: string, category: string, page = 1, limit = 6): Promise<{ data: Event[], totalPages: number }> {

      // Construct the condition dynamically
      const conditions: any = {};
    
      // If query is provided, apply title filtering
      if (query) {
        conditions.title = { $regex: query, $options: 'i' }; // Case-insensitive regex for title search
      }
    
      // If category is provided, fetch category ID and apply filtering
      if (category) {
        const categoryCondition = await this.categoryService.findByName(category);
    
        if (!categoryCondition) {
          throw new Error('Category not found'); // Handle case where category is invalid
        }
    
        // Directly assign the category ID without using `new ObjectId`
        conditions.category = categoryCondition._id; // Mongoose will handle this internally
      }
    
      // Pagination
      const skipAmount = (Number(page) - 1) * Number(limit);
    
      // Find events matching the conditions
      const events = await this.eventModel
        .find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(Number(limit))
        .populate('organizer', '_id firstName lastName email')
        .populate('category', '_id name')
        .exec();
    
      // Count total events for pagination
      const eventsCount = await this.eventModel.countDocuments(conditions).exec();
    
      return { data: events, totalPages: Math.ceil(eventsCount / limit) };
    }
    
    

      //get related events 
      async findRelated(categoryId: string, eventId: string, limit = 3, page = 1): Promise<{ data: Event[], totalPages: number }> {
        const skipAmount = (page - 1) * limit;
        

        //Find the related events that are not equal to the current event
        const events = await this.eventModel
          .find({
            category: categoryId,
            _id: { $ne: eventId },
          })
          .sort({ createdAt: 'desc' })
          .skip(skipAmount)
          .limit(limit)
          .populate('organizer', '_id firstName lastName email')
          .populate('category', '_id name')
          .exec();
          
        const eventsCount = await this.eventModel.countDocuments({
          category: categoryId,
          _id: { $ne: eventId },
        }).exec();
    
        return { data: events, totalPages: Math.ceil(eventsCount / limit) };
      }


}
