import { Request } from "express";
import { getEventsQuerySchema } from "../../validation/eventPayloadSchema"
import { connectToDB } from "../../db/dbConnection";
import moment from "moment";



export class FetchEventHandler {
    public static validatePayload(req: Request) {
        const validation = getEventsQuerySchema.validate(req.query);
        const { error } = validation;
        let failedValidation = error ? error.message : null;
        return failedValidation;
    }

    public static async fetchEvents(req: Request) {
        if (req.query["next_page_token"]) {
            let eventRecords = await this.fetchPaginatedEvents(req);
            return eventRecords;
        }

        let connection = await connectToDB();
        let selectQuery = `SELECT * FROM events LIMIT 20`;
        let [events] = await connection.query<any[]>(selectQuery);
        let reversedRows = events.reverse();
        let lastEvent = reversedRows[0];
        let nextPageToken = lastEvent.event_id;
        let updatedEventList = this.setEventStatus(events);

        return {
            events: updatedEventList,
            nextPageToken
        }

    }

    private static async fetchPaginatedEvents(req: Request) {
        let nextPageToken = +req.query["next_page_token"]!;
        await this.validateNextPageToken(nextPageToken);

        let connection = await connectToDB();
        let selectQuery = `SELECT * FROM events WHERE event_id > ? ORDER BY event_id LIMIT 20`;
        let [events] = await connection.query<any[]>(selectQuery, [nextPageToken]);

        if(!events.length){
            let errorObject = {
                status: 404,
                message: "End of Page"
            }
            throw errorObject;
        }

        let reversedRows = events.reverse();
        let lastEvent = reversedRows[0];
        nextPageToken = lastEvent.event_id;

        let updatedEventList = this.setEventStatus(events);

        return {
            events: updatedEventList,
            nextPageToken
        }
    }

    private static async validateNextPageToken(nextPageToken: number) {
        let connection = await connectToDB();
        let selectQuery = `SELECT * FROM events WHERE event_id = ?`;
        let [eventRecord] = await connection.query<any[]>(selectQuery, [nextPageToken]);

        if (!eventRecord.length) {
            let errorObject = {
                status: 400,
                message: "Invalid next_page_token provided"
            }
            throw errorObject;
        }

    }

    private static setEventStatus(eventList: Record<string, any>[]) {
        let updatedEventList = eventList.map(event => {
            let today = moment().format("YYYY-MM-DD");
            let end = moment(event.end_date).format("YYYY-MM-DD");
            event.event_status = (moment(today) > moment(end)) ? "inactive" : "active";

            return event;

        })

        return updatedEventList;

    }


}
