import express from "express";
import eventRouter from "./Routers/eventRouter";
import countryRouter from "./Routers/countryRouter";
import yearRouter from "./Routers/yearRouter";
import { conectToMongo } from "./Data/DB";
import 'dotenv/config';
import cors  from 'cors';
import http from 'http';
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000
const app = express()

conectToMongo()
app.use(express.json());
app.use("/api/events", eventRouter);
app.use("/api/countries", countryRouter);
app.use("/api/years", yearRouter);

app.listen(PORT,()=>{
    console.log(`Server is running, visit "http://localhost:${PORT}"`);
})
