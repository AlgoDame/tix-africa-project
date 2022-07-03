import { Request } from "express";
import { createEventSchema } from "../../validation/eventPayloadSchema";
import { connectToDB } from "../../db/dbConnection";
import moment from "moment";



export class CreateEventHandler {
    
    public static validatePayload(req: Request) {
        const validation = createEventSchema.validate(req.body);
        const { error } = validation;
        let failedValidation = error ? error.message : null;
        return failedValidation;
    }

    public static async createEventRecord(req: Request) {
    
        let {
            user_id,
            event_name,
            event_description,
            event_type,
            start_date,
            end_date
        } = req.body;

        this.validateDate(start_date, end_date);
        
        let createEventQuery = `INSERT INTO events 
        (user_id, event_name, event_description, event_type, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?)`;

        let connection = await connectToDB();
        let [eventRows,fields] = await connection.query(createEventQuery, [user_id, event_name, event_description, event_type, start_date, end_date]);
        console.log("event rows: ", eventRows);

        let selectEventQuery = `SELECT * FROM events WHERE event_name = ? AND user_id = ?`;
        let [eventResult] = await connection.query(selectEventQuery, [event_name, user_id]);
        return eventResult;

    }

    private static validateDate(startDate:string, endDate:string){
        let today = moment().format("YYYY-MM-DD");
        let start = moment(startDate).format("YYYY-MM-DD");
        let end = moment(endDate).format("YYYY-MM-DD");

        let errorObject = {
            status: 400,
            message: "Cannot create event in the past."
        }

        if(moment(today) > moment(start)){
            throw errorObject
        }

        if(moment(today) > moment(end)){
            throw errorObject
        }

    }

    
    



}
