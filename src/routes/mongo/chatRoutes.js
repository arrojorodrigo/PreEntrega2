import { Router } from "express";
import {getChat} from "../../controllers/chatControllers.js"
const router = Router();

router.get("/", getChat);

export default router;

