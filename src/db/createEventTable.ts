import { connectToDB } from "./dbConnection";
import { eventSchema } from "../schema/eventSchema";

export async function createEventTable(){
    let connection = await connectToDB();
    const [rows, fields] = await connection.query(eventSchema);
    
}


