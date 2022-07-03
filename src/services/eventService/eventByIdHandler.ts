import { Request } from "express";
import { connectToDB } from "../../db/dbConnection";
import moment from "moment";



export class UserEventHandler {

    public static async fetchUserEvents(req: Request) {
        let userId = req.params.user_id;
        let connection = await connectToDB();
        let selectEventQuery = `SELECT * FROM events WHERE user_id = ?`;
        let [eventResult] = await connection.query(selectEventQuery, [userId]);
        if (Array.isArray(eventResult) && eventResult.length){
            let updatedEventList = this.setEventStatus(eventResult);
            return updatedEventList;
        } 

        return eventResult;

    }

    private static setEventStatus(eventList:Record<string,any>[]){
        let updatedEventList = eventList.map(event => {
            let today = moment().format("YYYY-MM-DD");
            let end = moment(event.end_date).format("YYYY-MM-DD");
            event.event_status = (moment(today) > moment(end)) ? "inactive": "active";

            return event;

        })

        return updatedEventList;
        
    }


}
