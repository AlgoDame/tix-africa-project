import { Request, Response } from "express";
import { BaseService } from "../baseService";
import { CreateEventHandler } from "./createEventHandler";
import { UserEventHandler } from "./eventByIdHandler";
import { UpdateEventHandler } from "./updateEventHandler";
import { FetchEventHandler } from "./getEventsHandler";

export class EventService extends BaseService {

    public async createEvent(req: Request, res: Response) {
        try {
            let failedValidation = CreateEventHandler.validatePayload(req);

            if (failedValidation) return this.sendError(req, res, 400, failedValidation);

            let eventRecord = await CreateEventHandler.createEventRecord(req);

            if (Array.isArray(eventRecord) && !eventRecord.length) {
                throw new Error("Failed to create event");
            }

            return this.sendResponse(req, res, 201, eventRecord);

        } catch (error: any) {
            console.error(`Error occurred in eventService::: ${error}`);
            if (error.status) {
                return this.sendError(req, res, error.status, error.message);
            }
            return this.sendError(req, res, 500, error.message);
        }
    }

    public async getUserEvents(req: Request, res: Response) {
        try {
            let userEvents = await UserEventHandler.fetchUserEvents(req);
            return this.sendResponse(req, res, 200, userEvents);

        } catch (error: any) {
            console.error(`Error occurred in eventService::: ${error}`);
            if (error.status) {
                return this.sendError(req, res, error.status, error.message);
            }
            return this.sendError(req, res, 500, error.message);
        }
    }

    public async updateEvent(req: Request, res: Response) {
        try {
            let updatedEvent = await UpdateEventHandler.updateEventRecord(req);
            return this.sendResponse(req, res, 200, updatedEvent);

        } catch (error: any) {
            console.error(`Error occurred in eventService::: ${error}`);
            if (error.status) {
                return this.sendError(req, res, error.status, error.message);
            }
            return this.sendError(req, res, 500, error.message);
        }
    }

    public async getAllEvents(req: Request, res: Response) {
        try {
            if(req.query){
                let failedValidation = FetchEventHandler.validatePayload(req);
                if (failedValidation) return this.sendError(req, res, 400, failedValidation);
            }
            
            let events = await FetchEventHandler.fetchEvents(req);
            return this.sendResponse(req, res, 200, events);

        } catch (error: any) {
            console.error(`Error occurred in eventService::: ${error}`);
            if (error.status) {
                return this.sendError(req, res, error.status, error.message);
            }
            return this.sendError(req, res, 500, error.message);
        }
    }

}
