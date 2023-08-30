import { Router } from "express";
import {validateRequest,} from "../../middleware/validators.js";
import { allProducts, createProduct, deleteProduct, oneProduct, updateProduct } from "../../controllers/productControllers.js";
import storage from "../../config/multerConfig.js";

const router = Router();

router.use(multer({ storage }).single("thumbnail"));

router.get("/", allProducts);

router.get("/:id", oneProduct);

router.post("/", validateRequest, createProduct);

router.put("/:id", validateRequest, updateProduct);

router.delete("/:id", deleteProduct);

export default router;

