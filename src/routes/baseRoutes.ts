import express from "express";
import { BaseController } from "../controllers/baseController";

const router = express.Router();
new BaseController().loadRoutes("/users", router);

export { router as apiRouter };
