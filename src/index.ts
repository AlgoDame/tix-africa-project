import express from "express";
import morgan from "morgan";
import { initSchemas } from "./db/initQuery";
import { apiRouter } from "./routes/baseRoutes";
import dotenv from "dotenv";
import { connectToDB } from "./db/dbConnection";
import { eventRouter } from "./routes/eventRoutes";
import { ticketRouter } from "./routes/ticketRoutes";
dotenv.config();



export const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/v1/api",
    apiRouter,
    eventRouter,
    ticketRouter
);

connectToDB().then(conncetion => console.log("::: 🚀Connected to Database :::"));


app.listen(PORT, () =>
    console.log(`🚀 REST API server ready at ⭐️: http://localhost:${PORT}`)
);

initSchemas();
