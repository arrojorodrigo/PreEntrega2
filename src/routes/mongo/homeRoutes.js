import { Router } from "express";
const router = Router();
import { renderHome } from "../../controllers/homeControllers.js";



router.get("/", renderHome);



export default router;

