import { connectToDB } from "./dbConnection";
import { userSchema } from "../schema/userSchema";

export async function createUserTable(){
    let connection = await connectToDB();
    const [rows, fields] = await connection.query(userSchema);
    
}


