import { Router } from "express";
import { getEventsByCasualties } from "../controllers/eventController";

const router = Router()
router.get("/", getEventsByCasualties)

export default router;
