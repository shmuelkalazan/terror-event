import { Router } from "express";
import { getAverageCasualtiesByCountry, getAverageCasualtiesByCountryId, getCountriesWhereOrganizationIsTop, getOrganizationByCasualtiesNumber, getOrganizationByCountry } from "../controllers/countryController";

const router = Router()
router.get("/id/:id", getAverageCasualtiesByCountryId)
router.get("/country/:country", getOrganizationByCasualtiesNumber)
router.get("/country/organization/:organization", getCountriesWhereOrganizationIsTop)
router.get("/:country", getOrganizationByCountry)
router.get("/", getAverageCasualtiesByCountry)

export default router
