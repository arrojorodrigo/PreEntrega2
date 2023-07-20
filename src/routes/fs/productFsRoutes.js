import { Router } from "express";
const router = Router();
import ProductDatabase from "../../daos/fs/productManager.js";
const path = "src/db/products.json";
const productDatabase = new ProductDatabase(path);
import { validateNumber } from "../../utils/helpers.js";
import {
  validateRequest,
  validateNumberParams,
  validateCodeUnique,
} from "../../middleware/validators.js";
import multer from "multer";

//configuracion del multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

router.use(multer({ storage }).single("thumbnail"));

//Rutas

router.get("/", async (req, res) => {
  try {
    const products = await productDatabase.getProducts();
    const { limit } = req.query;
    const isValidLimit = validateNumber(limit);

    if (products) {
      const productsToShow = isValidLimit ? products.slice(0, limit) : products;
      res.status(200).json({
        status: "success",
        payload: productsToShow,
      });
    } else {
      res.status(200).json({ status: "success", payload: [] });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/:id", validateNumberParams, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productDatabase.getProductById(id);
    product
      ? res.status(200).json({
          status: "success",
          payload: product,
        })
      : res.status(404).json({
          status: "error",
          message: "Sorry, no product found by id: " + id,
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.post("/", validateRequest, validateCodeUnique, async (req, res) => {
  try {
    const newProduct = req.body;
    const photo = req.file;
    newProduct.thumbnail = "/uploads/" + photo.filename;
    const productCreated = await productDatabase.addProduct(newProduct);
    res.redirect("/");
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.put("/:id", validateRequest, validateNumberParams, async (req, res) => {
  try {
    const id = req.params.id;
    const newProduct = req.body;
    const productUpdated = await productDatabase.updateProduct(id, newProduct);
    res.status(200).json({
      status: "success",
      payload: productUpdated,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.delete("/:id", validateNumberParams, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productDatabase.getProductById(id);
    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Sorry, no product found by id: " + id,
        payload: {},
      });
      return;
    }
    const productDeleted = await productDatabase.deleteProduct(id);
    res.status(200).json({
      status: "success",
      payload: productDeleted,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;
