import { createUserTable } from "./createUserTable";
import { createEventTable } from "./createEventTable";
import { createTicketTable } from "./createTicketTable";

export async function initSchemas() {
    await createUserTable();
    await createEventTable();
    await createTicketTable();

}