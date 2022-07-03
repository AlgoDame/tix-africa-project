import express from "express";
import { TicketController } from "../controllers/ticketController";

const router = express.Router();
new TicketController().loadRoutes("/ticket", router);

export { router as ticketRouter };
