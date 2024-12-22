import { Router } from "express";
import { getAverageOfCasualtiesByYear, getYearEventsByOrganization } from "../controllers/yearController";

const router = Router()
router.get("/year/:year", getYearEventsByOrganization)
router.get("/:year/:number", getAverageOfCasualtiesByYear)

export default router;
