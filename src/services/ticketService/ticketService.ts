import { Request, Response } from "express";
import { BaseService } from "../baseService";
import { CreateTicketHandler } from "./ticketHandler";

export class TicketService extends BaseService {

    public async createTicket(req: Request, res: Response) {
        try {
            let failedValidation = CreateTicketHandler.validatePayload(req);

            if (failedValidation) return this.sendError(req, res, 400, failedValidation);

            let ticketRecord = await CreateTicketHandler.createTicketRecord(req);

            if (Array.isArray(ticketRecord) && !ticketRecord.length) {
                throw new Error("Failed to create ticket");
            }

            return this.sendResponse(req, res, 201, ticketRecord);

        } catch (error: any) {
            console.error(`Error occurred in ticketService::: ${error}`);
            if (error.status) {
                return this.sendError(req, res, error.status, error.message);
            }
            return this.sendError(req, res, 500, error.message);
        }
    }

    
}
