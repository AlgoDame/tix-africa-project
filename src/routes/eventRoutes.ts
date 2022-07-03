import express from "express";
import { EventController } from "../controllers/eventController";

const router = express.Router();
new EventController().loadRoutes("/event", router);

export { router as eventRouter };
