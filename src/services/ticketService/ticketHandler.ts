import { Request } from "express";
import { createTicketSchema } from "../../validation/ticketPayloadSchema";
import { connectToDB } from "../../db/dbConnection";



export class CreateTicketHandler {

    public static validatePayload(req: Request) {
        const validation = createTicketSchema.validate(req.body);
        const { error } = validation;
        let failedValidation = error ? error.message : null;
        return failedValidation;
    }

    public static async createTicketRecord(req: Request) {
        let eventRecord = await this.validateEventId(req);

        if (req.body.ticket_type.toLowerCase() === "free") {
            let ticketRecord = await this.createFreeTicket(req, eventRecord);
            return ticketRecord;
        }

        let ticketRecord = await this.createPaidTicket(req, eventRecord);
        return ticketRecord;

    }

    private static async validateEventId(req: Request){
        let eventId = +req.body.event_id;

        let connection = await connectToDB();
        let selectQuery = `SELECT * FROM events WHERE event_id = ?`;
        let [result] = await connection.query<any[]>(selectQuery, [eventId]);
        

        if (Array.isArray(result) && !result.length) {
           
            let errorObject = {
                status: 404,
                message: "Invalid event_id"
            }
            throw errorObject
        }
     
        return result;

    }

    private static async createFreeTicket(req: Request, eventRecord:any[]) {
        let {
            event_id,
            ticket_description,
            ticket_type,
            ticket_price
        } = req.body;

        if(eventRecord[0].event_type == "free"){
            ticket_price = 0;
        }

        let createTicketQuery = `INSERT INTO tickets 
        (event_id, ticket_description, ticket_type, ticket_price)
        VALUES (?, ?, ?, ?)`;

        let connection = await connectToDB();
        let [rows, fields] = await connection.query(
            createTicketQuery,
            [event_id, ticket_description, ticket_type, ticket_price]
        );

        let selectTicketQuery = `SELECT * FROM tickets WHERE event_id = ?, ticket_description = ? AND ticket_price = ?`;
        let [ticketResult] = await connection.query(selectTicketQuery, [event_id, ticket_description, ticket_price]);
        return ticketResult;

    }

    private static async createPaidTicket(req: Request, eventRecord:any[]) {
        let {
            event_id,
            ticket_description,
            ticket_type,
            ticket_price
        } = req.body;

        if(eventRecord[0].ticket_type == "free"){
            let errorObject = {
                status: 400,
                message: "Cannot create paid ticket on free event."
            }

            throw errorObject;
        }

        ticket_price = +ticket_price;

        let createTicketQuery = `INSERT INTO tickets 
        (event_id, ticket_description, ticket_type, ticket_price)
        VALUES (?, ?, ?, ?)`;

        let connection = await connectToDB();
        let [rows, fields] = await connection.query(
            createTicketQuery,
            [event_id, ticket_description, ticket_type, ticket_price]
        );

        let selectTicketQuery = `SELECT * FROM tickets WHERE event_id = ? AND ticket_description = ? AND ticket_price = ?`;
        let [ticketResult] = await connection.query(selectTicketQuery, [event_id, ticket_description, ticket_price]);
        return ticketResult;

    }


}
