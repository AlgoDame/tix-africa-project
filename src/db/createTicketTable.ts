import { connectToDB } from "./dbConnection";
import { ticketSchema } from "../schema/ticketSchema";

export async function createTicketTable(){
    let connection = await connectToDB();
    const [rows, fields] = await connection.query(ticketSchema);
    
}


