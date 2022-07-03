import { Request } from "express";
import { createEventSchema } from "../../validation/eventPayloadSchema";
import { connectToDB } from "../../db/dbConnection";
import moment from "moment";



export class UpdateEventHandler {

    public static validatePayload(req: Request) {
        const validation = createEventSchema.validate(req.body);
        const { error } = validation;
        let failedValidation = error ? error.message : null;
        return failedValidation;
    }

    public static async updateEventRecord(req: Request) {
        let eventId = req.params.event_id;

        if (req.body.event_start) {
            this.validateDate(req.body.event_start);
        }

        if (req.body.event_end) {
            this.validateDate(req.body.event_end);
        }

        let connection = await connectToDB();
        let selectEventQuery = `SELECT * FROM events WHERE event_id = ?`;
        let [eventResult] = await connection.query(selectEventQuery, [eventId]);

        if (Array.isArray(eventResult) && !eventResult.length) {
            let errorObject = {
                status: 404,
                message: "Event not found"
            }
            throw errorObject;
        }

        let eventName = req.body.event_name || eventResult[0].event_name;
        let eventDescription = req.body.event_description || eventResult[0].event_description;
        let eventType = req.body.event_type || eventResult[0].event_type;
        let eventStart = req.body.event_start || eventResult[0].start_date;
        let eventEnd = req.body.event_end || eventResult[0].end_date;
        let eventStatus = this.setEventStatus(eventEnd);

        let updateEventQuery = `UPDATE events SET event_name = ?, event_description = ?,
        event_type = ?, start_date = ?, end_date = ?, event_status = ? WHERE event_id = ?`;

        await connection.query(
            updateEventQuery,
            [eventName, eventDescription, eventType, eventStart, eventEnd, eventStatus, eventId]
        );

        let [updatedEvent] = await connection.query("SELECT * FROM events WHERE event_id = ?", [eventId]);
        return updatedEvent;

    }

    private static validateDate(dateInput: string) {
        let today = moment().format("YYYY-MM-DD");
        let dateStr = moment(dateInput).format("YYYY-MM-DD");

        let errorObject = {
            status: 400,
            message: "Cannot create event in the past."
        }

        if (moment(today) > moment(dateStr)) {
            throw errorObject
        }

    }


    private static setEventStatus(endDate: string) {
        let today = moment().format("YYYY-MM-DD");
        let end = moment(endDate).format("YYYY-MM-DD");
        let status = (moment(today) > moment(end)) ? "inactive" : "active";
        return status;

    }

}
